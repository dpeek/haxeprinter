package haxeprinter;

import haxe.macro.Expr;
import haxeparser.Data;
import haxeparser.HaxeLexer;
import hxparse.LexerTokenSource;
import hxparse.TokenSource;

enum Node
{
	Group(nodes:Array<Node>);
	Token(s:String, style:Style);
}

class Formatter extends hxparse.Parser<HaxeLexer, Token> implements hxparse.ParserBuilder {

	var root:Node;
	var stack:Array<Array<Node>>;
	var group:Array<Node>;

	function add(s:String, style:Style)
	{
		group.push(Token(s, style));
	}

	function start()
	{
		var nodes = [];
		group.push(Group(nodes));
		stack.unshift(nodes);
	}

	function end()
	{
		if (stack.length == 0) throw 'stack is empty';
		stack.shift();
		group = stack[0];
	}


	
	var input:byte.ByteData;
	var buf = new StringBuf();
	var cfg:Config;
	var lastChar = null;
	var tabs:String = "";

	var col = 0;
	var lineBuf = new StringBuf();
	var lineLen = 0;
	var hasNewlined = false;

	public function new(input:byte.ByteData, config:Config, sourceName:String) {
		super(new LexerTokenSource(new HaxeLexer(input, sourceName), HaxeLexer.tok));
		this.input = input;
		this.cfg = config;

		this.group = [];
		this.root = Group(this.group);
	}
	
	public function getContent() {
		parseFile();
		newline();
		return buf.toString();
	}
	
	// printing
	
	function print(s:String, ?style:Style) {
		if (lineBuf.length == 0)
		{
			lineLen += tabs.length * 4;
			lineBuf.add(tabs);
		}

		#if js
		var escaped = StringTools.htmlEscape(s);
		if (style == null)
		{
			lineBuf.add(escaped);
		}
		else
		{
			var style = Std.string(style).substr(1).toLowerCase();
			lineBuf.add('<span class="$style">$escaped</span>');
		}
		#else
		lineBuf.add(s);
		#end

		lineLen += s.length;
		lastChar = s.charAt(s.length - 1);
	}

	function breakPoint(force:Bool=false)
	{
		if (col > 0)
		{
			if (force || col + lineLen > cfg.maximum_line_length)
			{
				col = 0;
				buf.add('\n$tabs\t');
			}
			else if (lineLen > 0)
			{
				buf.add(' ');
			}
		}
		
		col += lineLen;
		buf.add(lineBuf.toString());
		lineBuf = new StringBuf();
		lineLen = 0;
	}
	
	function tab() {
		print(tabs);
	}
	
	function newline() {
		hasNewlined = true;
		buf.add(lineBuf.toString() + '\n');
		lineBuf = new StringBuf();
		col = 0;
		lineLen = 0;
	}
	
	function moreTabs() {
		tabs += "\t";
	}
	
	function lessTabs() {
		tabs = tabs.substr(1);
	}
	
	function space() {
		if (lastChar != " ") print(" ");
	}
	
	function brace(cuddle:Bool) {
		if (cuddle) {
			space();
		} else {
			newline();
		}
	}
	
	function printString(s:String, pos:Position) {
		// TODO: interpolation formatting?
		var c = input.readString(pos.min, 1);
		print('$c$s$c', SString);
	}

	override function peek(n):Token {
		if (n != 0) throw 'n != 0';
		var tok = super.peek(n);
		return switch(tok.tok) {
			case CommentLine(s):
				print('//$s', SComment);
				junk();
				newline();
				peek(0);
			case Comment(s):
				print('/*$s*/', SComment);
				junk();
				var l1 = new hxparse.Position("", tok.pos.min, tok.pos.max).getLinePosition(input).lineMin;
				var tok2 = super.peek(0); // cannot use this.peek here in case another comment follows
				var l2 = new hxparse.Position("", tok2.pos.min, tok2.pos.max).getLinePosition(input).lineMin;
				if (l1 != l2) {
					newline();
				} else {
					print(" ");
				}
				peek(0);
			case Sharp("error"):
				junk();
				print("#error", SMacro);
				print(" ");
				switch(peek(0).tok) {
					case Const(CString(s)):
						junk();
						print('"$s"', SString);
					case _:
						throw "String expected";
				}
				peek(0);
			case Sharp(s = "if" | "elseif"):
				hasNewlined = false;
				print('#$s', SMacro);
				print(" ");
				junk();
				skipMacroCond();
				if (hasNewlined) newline();
				else space();
				peek(0);
			case Sharp(s = "end" | "else"):
				hasNewlined = false;
				print('#$s', SMacro);
				junk();
				if (hasNewlined) newline();
				else space();
				peek(0);
			case Sharp(s):
				print('#$s', SMacro);
				junk();
				peek(0);
			case _:
				tok;
		}
	}
	
	function skipMacroCond() {
		switch super.peek(0).tok {
			case tok = Const(CIdent(_)) | Kwd(_):
				print(TokenDefPrinter.print(tok), SMacro);
				junk();
			case POpen:
				var pCount = 0;
				while(true) {
					switch super.peek(0).tok {
						case POpen:
							++pCount;
							junk();
							print("(", SMacro);
						case PClose:
							--pCount;
							junk();
							print(")", SMacro);
							if (pCount == 0) {
								return;
							}
						case tok:
							junk();
							print(TokenDefPrinter.print(tok), SMacro);
					}
				}
			case Unop(OpNot):
				print("!", SMacro);
				junk();
				skipMacroCond();
			case tok:
				throw 'Invalid macro cond: $tok';
		}
	}
	
	function printModifier(modifier:Array<String>) {
		var order:Array<String> = cfg.modifier_order;
		modifier.sort(function(a,b) return order.indexOf(a) - order.indexOf(b));
		for (modifier in modifier) {
			print(modifier, SModifier);
			print(" ");
		}
	}
	
	// general parsing
	
	function parseAnyIdent(?style:Style) {
		switch stream {
			case [{tok:Const(CIdent(s))}]:
				print(s, style);
			case [{tok:Kwd(KwdMacro)}]:
				print("macro", style);
			case [{tok:Kwd(KwdNew)}]:
				print("new", style);
			case [{tok:Dollar(s)}]:
				print("$" +s, style);
		}
	}
	
	function parseTypeHint() {
		switch stream {
			case [{tok:DblDot}]:
				if (cfg.space_before_type_hint_colon) {
					space();
				}
				print(":");
				if (cfg.space_after_type_hint_colon) {
					space();
				}
				parseComplexType();
		}
	}
	
	function parseAssignment(spaceBefore:Bool, spaceAfter:Bool) {
		switch stream {
			case [{tok:Binop(OpAssign)}]:
				if (spaceBefore) {
					space();
				}
				print("=");
				if (spaceAfter) {
					space();
				}
				parseExpr();
		}
	}
	
	function parseFunction() {
		print("function", SKwd);
		print(" ");
		popt(parseAnyIdent.bind(null));
		popt(parseTypeParameters);
		expect(POpen);
		psep(Comma, parseFunctionArgument, withSpace(cfg.space_between_function_args));
		expect(PClose);
		popt(parseTypeHint);
		popt(parseExpr);
	}
	
	function parseFunctionArgument() {
		switch stream {
			case [{tok:Question}]:
				print("?");
			case _:
		}
		switch stream {
			case [{tok:Const(CIdent(s))}]:
				print(s, SIdent);
		}
		popt(parseTypeHint);
		popt(parseAssignment.bind(cfg.space_around_function_arg_assign, cfg.space_around_function_arg_assign));
	}
	
	function parseModifier() {
		var modifiers = [];
		while(true) {
			switch stream {
				case [{tok:Kwd(k = KwdStatic | KwdPublic | KwdPrivate | KwdExtern | KwdInline | KwdMacro | KwdDynamic | KwdOverride)}]:
					var modifier = Std.string(k).substr(3).toLowerCase();
					modifiers.push(modifier);
					print(modifier, SKwd);
					space();
				case _:
					return modifiers;
			}
		}
	}
	
	function parseCallArguments() {
		switch stream {
			case [{tok:POpen}]:
				print("(");
				psep(Comma, parseExpr, withSpace(cfg.space_between_function_args));
				expect(PClose);
		}
	}
	
	function parseMetaName() {
		switch stream {
			case [{tok:DblDot}]:
				print(":");
			case _:
		}
		switch stream {
			case [{tok:Const(CIdent(s))}]:
				print(s, SIdent);
			case [{tok:Kwd(kwd)}]:
				print(kwd.getName().substr(3).toLowerCase(), SKwd);
		}
	}
	
	function parseMeta() {
		switch stream {
			case [{tok:At}]:
				print("@");
				parseMetaName();
				popt(parseCallArguments);
				parseMeta();
			case _:
				return;
		}
	}
	
	// type declaration parsing
	
	function parseFile() {
		switch (peek(0))
		{
			case {tok:Kwd(KwdPackage | KwdImport | KwdUsing)}:
			case _:
				newline();
				if (cfg.empty_line_before_type) newline();
		}

		parseMeta();
		parseModifier();

		switch stream {
			case [{tok:Kwd(KwdPackage)}]:
				print("package", SDecl);
				if (peek(0).tok == Semicolon) {
					junk();
					print(";");
				} else {
					print(" ");
					parseDotPath();
					expect(Semicolon);
				}
				if (cfg.empty_line_after_package) {
					newline();
				}
			case [{tok:Kwd(kwd = KwdImport | KwdUsing)}]:
				newline();
				print(kwd == KwdImport ? "import" : "using", SDecl);
				print(" ");
				popt(parseDotPath);
				switch stream {
					case [{tok:Binop(OpMult)}]:
						print("*", SType);
					case _:
				}
				switch stream {
					case [{tok:Kwd(KwdIn)}]:
						print(" ");
						print("in", SDecl);
						print(" ");
						parseAnyIdent(SType);
					case _:
				}
				semicolon();
				if (cfg.empty_line_after_import) {
					newline();
				}
			case [{tok:Kwd(kwd = KwdClass | KwdInterface)}]:
				print(kwd == KwdClass ? "class" : "interface", SDecl);
				print(" ");
				parseAnyIdent(SType);
				popt(parseTypeParameters);
				parseHeritance();
				brace(cfg.cuddle_type_braces);
				expect(BrOpen);
				moreTabs();
				parseClassFields(false);
			case [{tok:Kwd(KwdEnum)}]:
				print("enum", SDecl);
				print(" ");
				parseAnyIdent(SType);
				popt(parseTypeParameters);
				brace(cfg.cuddle_type_braces);
				expect(BrOpen);
				moreTabs();
				parseEnumFields(false);
			case [{tok:Kwd(KwdTypedef)}]:
				// newline();
				// if (cfg.empty_line_before_type) {
				// 	newline();
				// }
				// parseModifier();
				print("typedef", SDecl);
				print(" ");
				parseAnyIdent(SType);
				popt(parseTypeParameters);
				if (cfg.space_around_typedef_assign) {
					space();
				}
				expect(Binop(OpAssign));
				if (cfg.space_around_typedef_assign) {
					space();
				}
				parseComplexType();
				semicolon();
			case [{tok:Kwd(KwdAbstract)}]:
				// newline();
				// if (cfg.empty_line_before_type) {
				// 	newline();
				// }
				// parseModifier();
				print("abstract", SDecl);
				print(" ");
				parseAnyIdent(SType);
				popt(parseTypeParameters);
				popt(parseAbstractThis);
				popt(parseAbstractRelations);
				brace(cfg.cuddle_type_braces);
				expect(BrOpen);
				moreTabs();
				parseClassFields(false);
			case [{tok:Eof}]:
				return;
		}
		parseFile();
	}
	
	function parseTypeParameters() {
		switch stream {
			case [{tok:Binop(OpLt)}]:
				print("<");
				psep(Comma, parseTypeParameter, withSpace(cfg.space_between_type_params));
				expect(Binop(OpGt));
		}
	}
	
	function parseTypeParameter() {
		parseAnyIdent(SType);
		popt(parseConstraints);
	}
	
	function parseConstraints() {
		switch stream {
			case [{tok:DblDot}]:
				print(":");
				switch stream {
					case [{tok:POpen}]:
						print("(");
						psep(Comma, parseComplexType, withSpace(cfg.space_between_type_param_constraints));
						expect(PClose);
					case [_ = parseComplexType()]:
				}
		}
	}

	// class parsing
	
	function parseHeritance() {
		while(true) {
			switch stream {
				case [{tok:Kwd(KwdExtends)}]:
					breakPoint();
					print("extends", SDecl);
					space();
					parseComplexType();
					breakPoint(cfg.extends_on_newline);
				case [{tok:Kwd(KwdImplements)}]:
					breakPoint();
					print("implements", SDecl);
					space();
					parseComplexType();
					breakPoint(cfg.implements_on_newline);
				case _:
					break;
			}
		}
	}
	
	function parseClassFields(hadField:Bool) {
		if (hadField && cfg.empty_line_between_fields) {
			newline();
		}
		newline();
		parseMeta();
		parseModifier();
		switch stream {
			case [{tok:Kwd(KwdVar)}]:
				print("var", SKwd);
				print(" ");
				parseAnyIdent();
				popt(parsePropertyAccessors);
				popt(parseTypeHint);
				popt(parseAssignment.bind(cfg.space_around_property_assign, cfg.space_around_property_assign));
				semicolon();
			case [{tok:Kwd(KwdFunction)}]:
				parseFunction();
				semicolon();
			case [{tok:BrClose}]:
				lessTabs();
				// if (hadField) {
				// 	newline();
				// } else {
				// 	space();
				// }
				print("}");
				return;
		}
		parseClassFields(true);
	}
	
	function parsePropertyIdent() {
		switch stream {
			case [_ = parseAnyIdent(SKwd)]:
			case [{tok:Kwd(KwdDefault)}]:
				print("default", SKwd);
			case [{tok:Kwd(KwdNull)}]:
				print("null", SKwd);
			case [{tok:Kwd(KwdDynamic)}]:
				print("dynamic", SKwd);
		}
	}
	
	function parsePropertyAccessors() {
		switch stream {
			case [{tok:POpen}]:
				print("(");
				parsePropertyIdent();
				if (cfg.space_between_property_get_set) {
					print(" ");
				}
				expect(Comma);
				parsePropertyIdent();
				expect(PClose);
		}
	}
	
	
	// enum parsing
	
	function parseEnumFields(hadField:Bool) {
		parseMeta();
		switch stream {
			case [{tok: BrClose}]:
				lessTabs();
				if (hadField) {
					newline();
				}
				print("}");
				return;
			case _:
		}
		if (cfg.empty_line_between_enum_constructors) {
			newline();
		}
		newline();
		parseAnyIdent(SType);
		popt(parseTypeParameters);
		switch stream {
			case [{tok:POpen}]:
				print("(");
				psep(Comma, parseFunctionArgument, withSpace(cfg.space_between_function_args));
				expect(PClose);
			case _:
		}
		popt(parseTypeHint);
		semicolon();
		parseEnumFields(true);
	}
	
	// abstract parsing
	
	function parseAbstractThis() {
		switch stream {
			case [{tok:POpen}]:
				print("(");
				parseComplexType();
				expect(PClose);
		}
	}
	
	function parseAbstractRelations() {
		switch stream {
			case [{tok:Const(CIdent(s = "from" | "to"))}]:
				space();
				print(s, SDecl);
				parseComplexType();
				parseAbstractRelations();
		}
	}
	
	// type parsing
	
	function parseDotPath() {
		switch stream {
			case [_ = parseAnyIdent(SType)]:
		}
		popt(parseDotPathNext);
	}
	
	function parseDotPathNext() {
		switch stream {
			case [{tok:Dot}]:
				print(".", SType);
				parseDotPath();
			case [{tok:Binop(OpLt)}]:
				print("<");
				psep(Comma, parseComplexType, withSpace(cfg.space_between_type_params));
				expect(Binop(OpGt));
		}
	}
	
	function parseStructureFields() {
		switch stream {
			case [_ = parseClassFields(false)]:
			case [ _ = psep(Comma, parseStructureTypeField, withSpace(cfg.space_between_anon_type_fields))]:
				space();
				expect(BrClose);
		}
	}

	function parseComplexType() {
		switch stream {
			case [_ = parseDotPath()]:
			case [{tok:POpen}]:
				print("(");
				parseComplexType();
				expect(PClose);
			case [{tok:BrOpen}]:
				// TODO: config?
				print("{ ");
				switch stream {
					case [{tok:Binop(OpGt)}]:
						print("> ");
						parseComplexType();
						expect(Comma);
						parseStructureFields();
					case [_ = parseStructureFields()]:
				}
		}
		popt(parseComplexTypeNext);
	}
	
	function parseComplexTypeNext() {
		switch stream {
			case [{tok:Arrow}]:
				print(" -> "); // TODO: config?
				parseComplexType();
		}
	}
	
	function parseStructureTypeField() {
		switch stream {
			case [{tok:Question}]:
				print("?");
			case _:
		}
		parseAnyIdent();
		if (cfg.space_before_structure_colon) {
			space();
		}
		expect(DblDot);
		if (cfg.space_after_structure_colon) {
			space();
		}
		parseComplexType();
	}
	
	// expression parsing
	
	function parseStructureElement() {
		switch stream {
			case [_ = parseAnyIdent()]:
			case [{tok:Const(CString(s)), pos:p}]:
				printString(s, p);
		}
		if (cfg.space_before_structure_colon) {
			space();
		}
		expect(DblDot);
		if (cfg.space_after_structure_colon) {
			space();
		}
		parseExpr();
	}
	
	function parseVarDeclaration() {
		parseAnyIdent();
		popt(parseTypeHint);
		popt(parseAssignment.bind(true, true));
	}
	
	function parseMacroExpr() {
		switch stream {
			case [{tok:DblDot}]:
				print(" : "); // TODO
				parseComplexType();
			case [{tok:Kwd(KwdVar)}]:
				print("var", SKwd);
				print(" ");
				psep(Comma, parseVarDeclaration, withSpace(true)); // TODO
			case [_ = parseExpr()]:
		}
	}
	
	function parseCatch() {
		switch stream {
			case [{tok:Kwd(KwdCatch)}]:
				print("catch", SKwd);
				print(" ");
				expect(POpen);
				parseAnyIdent();
				expect(DblDot);
				parseComplexType();
				expect(PClose);
				parseExpr();
		}
	}
	
	function parseBlockElement() {
		newline();
		switch stream {
			case [{tok:Kwd(KwdVar)}]:
				print("var", SKwd);
				print(" ");
				psep(Comma, parseVarDeclaration, withSpace(true)); // TODO: config?
				semicolon();
			case [_ = parseExpr()]:
				semicolon();
		}
	}
	
	// TODO: this whole part is really awkward
	function parseBlockOrStructure() {
		newline();
		print('{');
		newline();
		moreTabs();

		switch stream {
			case [{tok:fieldToken = Const(CIdent(_) | CString(_)), pos:p}]:
				switch stream {
					case [{tok:DblDot}]:
						// structure
						// TODO: config?
						print(TokenDefPrinter.print(fieldToken), SIdent);
						if (cfg.space_before_structure_colon) {
							space();
						}
						print(":");
						if (cfg.space_after_structure_colon) {
							space();
						}
						parseExpr();
						switch stream {
							case [{tok:Comma}]:
								print(",");
								psep(Comma, parseStructureElement, withSpace(cfg.space_between_anon_type_fields));
								expect(BrClose);
							case [{tok:BrClose}]:
								lessTabs();
								newline();
								print("}");
							case _:
								unexpected();
						}
					case _:
						// block
						// moreTabs();
						// newline();
						switch(fieldToken) {
							case Const(CIdent(s)):
								print(s, SIdent);
							case Const(CString(s)):
								printString(s, p);
							case _:
								throw false;
						}
						parseExprNext();
						semicolon();
						plist(parseBlockElement);
						lessTabs();
						newline();
						expect(BrClose);
				}
			case [{tok:BrClose}]:
				print("}");
			case _:
				// moreTabs();
				plist(parseBlockElement);
				lessTabs();
				newline();
				expect(BrClose);
		}
	}

	function parseExpr() {
		parseMeta();
		switch stream {
			case [{tok:Const(CInt(s) | CFloat(s))}]:
				print(s, SConst);
			case [{tok:Const(CIdent(s))}]:
				print(s, SIdent);
			case [{tok:Const(CString(s)), pos:p}]:
				printString(s, p);
			case [{tok:Const(CRegexp(p, o))}]:
				print('~/$p/$o', SConst);
			case [{tok:Kwd(KwdTrue)}]:
				print("true", SConst);
			case [{tok:Kwd(KwdFalse)}]:
				print("false", SConst);
			case [{tok:Kwd(KwdNull)}]:
				print("null", SConst);
			case [{tok:Kwd(KwdThis)}]:
				print("this", SDecl);
			case [{tok:Kwd(KwdUntyped)}]:
				print("untyped", SKwd);
				print(" ");
				parseExpr();
			case [{tok:Kwd(KwdMacro)}]:
				print("macro", SKwd);
				print(" ");
				parseMacroExpr();
			case [{tok:Dollar(s)}]:
				print("$" + s, SKwd);
				switch stream {
					case [{tok:BrOpen}]:
						print("{");
						parseExpr();
						expect(BrClose);
					case _:
				}
			case [{tok:Kwd(KwdBreak)}]:
				print("break", SKwd);
			case [{tok:Kwd(KwdContinue)}]:
				print("continue", SKwd);
			case [{tok:Kwd(KwdFunction)}]:
				parseFunction();
			case [{tok:Kwd(KwdReturn)}]:
				print("return", SKwd);
				print(" ");
				popt(parseExpr);
			case [{tok:Kwd(KwdThrow)}]:
				print("throw", SKwd);
				print(" ");
				parseExpr();
			case [{tok:Kwd(KwdCast)}]:
				switch stream {
					case [{tok:POpen}]:
						print("("); // TODO: config?
						parseExpr();
						switch stream {
							case [{tok:Comma}]:
								print(","); // TODO: config?
								parseComplexType();
							case _:
						}
						expect(PClose);
					case [_ = parseExpr()]:
				}
			case [{tok:Kwd(KwdVar)}]:
				print("var", SKwd);
				print(" ");
				parseVarDeclaration();
			case [{tok:Binop(OpSub)}]:
				print("-");
				parseExpr();
			case [{tok:BrOpen}]:
				parseBlockOrStructure();
			case [{tok:BkOpen}]:
				print("[");
				psep(Comma, parseExpr, withSpace(true)); // TODO
				expect(BkClose);
			case [{tok:POpen}]:
				print("(");
				parseExpr();
				switch stream {
					case [{tok:DblDot}]:
						print(" : "); // TODO
						parseComplexType();
						expect(PClose);
					case [{tok:PClose}]:
						print(")");
					case _:
						unexpected();
				}
			case[{tok:Kwd(KwdIf)}]:
				print("if", SKwd);
				print(" ");
				expect(POpen);
				parseExpr();
				expect(PClose);
				space();
				parseExpr();
				semicolon();
				switch stream {
					case [{tok:Kwd(KwdElse)}]:
						print("else", SKwd);
						print(" ");
						parseExpr();
					case _:
				}
			case [{tok:Kwd(KwdNew)}]:
				print("new", SKwd);
				print(" ");
				parseDotPath();
				expect(POpen);
				psep(Comma, parseExpr, withSpace(cfg.space_between_function_args));
				expect(PClose);
			case [{tok:Kwd(KwdFor)}]:
				print("for", SKwd);
				print(" "); // TODO: space config?
				expect(POpen);
				parseExpr();
				expect(PClose);
				parseExpr();
			case [{tok:Kwd(KwdWhile)}]:
				print("while", SKwd);
				print(" "); // TODO: space config?
				expect(POpen);
				parseExpr();
				expect(PClose);
				parseExpr();
			case [{tok:Kwd(KwdDo)}]:
				print("do", SKwd);
				print(" "); // TODO: config?
				parseExpr();
				expect(Kwd(KwdWhile));
				expect(POpen);
				parseExpr();
				expect(PClose);
			case [{tok:Unop(op)}]:
				print(new haxe.macro.Printer().printUnop(op));
				parseExpr();
			case [{tok:IntInterval(s)}]:
				print(s);
				print("...");
				parseExpr();
			case [{tok:Kwd(KwdTry)}]:
				print("try", SKwd);
				print(" ");
				parseExpr();
				plist(parseCatch);
			case [{tok:Kwd(KwdSwitch)}]:
				print("switch", SKwd);
				print(" ");
				parseExpr();
				space();
				expect(BrOpen);
				moreTabs();
				while(true) {
					switch stream {
						case [{tok:Kwd(KwdCase)}]:
							newline();
							print("case", SKwd);
							print(" ");
							psep(Comma, parseExpr, withSpace(true)); // TODO: config?
							switch stream  {
								case [{tok:DblDot}]:
									print(": ");
								case [{tok:Kwd(KwdIf)}]:
									print("if", SKwd);
									print(" ");
									expect(POpen);
									parseExpr();
									expect(PClose);
									expect(DblDot);
								case _:
									unexpected();
							}
							moreTabs();
							while(true) {
								switch(peek(0).tok) {
									case Kwd(KwdCase | KwdDefault) | BrClose:
										break;
									case _:
										newline();
										parseBlockElement();
								}
							}
							lessTabs();
						case [{tok:Kwd(KwdDefault)}]:
							newline();
							print("default", SKwd);
							expect(DblDot);
							moreTabs();
							while(true) {
								switch(peek(0).tok) {
									case BrClose:
										break;
									case _:
										newline();
										parseBlockElement();
								}
							}
							lessTabs();
						case [{tok:BrClose}]:
							print("}");
							break;
						case _:
							unexpected();
					}
				}
				lessTabs();
		}
		parseExprNext();
	}
	
	function parseExprNext() {
		switch stream {
			case [{tok:POpen}]:
				print("(");
				psep(Comma, parseExpr, withSpace(cfg.space_between_function_args));
				expect(PClose);
				parseExprNext();
			case [{tok:Dot}]:
				print(".");
				parseAnyIdent();
				parseExprNext();
			case [{tok:Binop(OpGt)}]:
				print(">");
				while(true) {
					switch stream {
						case [{tok:Binop(OpGt)}]:
							print(">");
						case [{tok:Binop(OpAssign)}]:
							print("=");
						case _:
							space();
							parseExpr();
							parseExprNext();
							break;
					}
				}
			case [{tok:Binop(op)}]:
				space();
				print(new haxe.macro.Printer().printBinop(op));
				space();
				parseExpr();
				parseExprNext();
			case [{tok:Kwd(KwdIn)}]:
				space();
				print("in", SKwd);
				print(" ");
				parseExpr();
				parseExprNext();
			case [{tok:BkOpen}]:
				print("[");
				parseExpr();
				expect(BkClose);
				parseExprNext();
			case [{tok:Question}]:
				print(" ? "); // TODO: config?
				parseExpr();
				space(); // TODO: config?
				expect(DblDot);
				space(); // TODO: config
				parseExpr();
				parseExprNext();
			case [{tok:Unop(op)}]:
				print(new haxe.macro.Printer().printUnop(op));
				parseExprNext();
			case _:
		}
	}
	
	// parsing helper
	
	function withSpace(b:Bool) {
		if (b) {
			return print.bind(" ");
		} else {
			return function() { }
		}
	}
	
	function semicolon() {
		switch stream {
			case [{tok:Semicolon}]:
				print(";");
			case _ if (last.tok == BrClose):
		}
	}
	
	function expect(tok:TokenDef) {
		if (!Type.enumEq(peek(0).tok, tok)) {
			throw (curPos().format(input)) + ':Expected $tok but found ${peek(0)}';
		}
		print(TokenDefPrinter.print(tok));
		junk();
	}
	
	function popt<T>(f:Void->T):Null<T> {
		return switch stream {
			case [v = f()]: v;
			case _: null;
		}
	}
	
	function psep<T>(sep:TokenDef, f:Void->T, fSep:Void->Void) {
		while(true) {
			try {
				f();
				var tok = peek(0);
				if (tok.tok == sep) {
					print(TokenDefPrinter.print(tok.tok));
					fSep();
					junk();
				} else {
					return;
				}
			} catch(e:hxparse.NoMatch<Dynamic>) {
				return;
			}
		}
	}
	
	function plist<T>(f:Void->T) {
		try {
			while(true) {
				f();
			}
		} catch(e:hxparse.NoMatch<Dynamic>) {}
	}
}

