package haxeprinter;

import haxeparser.Data;
import haxeparser.HaxeLexer;

class Config {
	public var empty_line_after_package = true;
	public var empty_line_after_import = false;
	public var empty_line_before_type = true;
	public var empty_line_between_fields = true;
	public var empty_line_between_enum_constructors = false;
	
	public var extends_on_newline = false;
	public var implements_on_newline = false;
	
	public var modifier_order = ["override", "public", "private", "static", "extern", "dynamic", "inline", "macro"];
	
	public var cuddle_type_braces = true;
	public var cuddle_method_braces = true;
	
	public var space_between_type_params = true;
	public var space_between_type_param_constraints = true;
	public var space_between_property_get_set = true;
	public var space_between_function_args = true;
	
	public var space_before_type_hint_colon = false;
	public var space_after_type_hint_colon = false;
	
	public var space_around_variable_assign = true;
	
	public var space_around_function_arg_assign = true;
	
	public var space_before_structure_colon = false;
	public var space_after_structure_colon = true;

	public var space_around_typedef_assign = true;
	
	public var space_after_structure_field_comma = true;
	
	public function new() { }
}

class Formatter extends hxparse.Parser<HaxeLexer, Token> implements hxparse.ParserBuilder {
	
	var input:byte.ByteData;
	var buf = new StringBuf();
	var preBuf = new StringBuf();
	var cfg:Config;
	var lastChar = null;
	var tabs:String = "";
	
	public function new(input:byte.ByteData, config:Config, sourceName:String) {
		super(new HaxeLexer(input, sourceName), HaxeLexer.tok);
		this.input = input;
		this.cfg = config;
	}
	
	public function getContent() {
		parseFile();
		return buf.toString();
	}
	
	// printing
	
	function print(s:String) {
		if (s != "\n" && s.charAt(0) != "\t" && preBuf.length > 0) {
			buf.add(preBuf.toString());
			preBuf = new StringBuf();
		}
		buf.add(s);
		lastChar = s.charAt(s.length - 1);
	}
	
	function tab() {
		print(tabs);
	}
	
	function newline() {
		print("\n");
		tab();
	}
	
	function moreTabs() {
		tabs += "\t";
	}
	
	function lessTabs() {
		tabs = tabs.substr(1);
	}
	
	function space() {
		if (lastChar != " ") {
			print(" ");
		}
	}
	
	function brace(cuddle:Bool) {
		if (cuddle) {
			space();
		} else {
			newline();
		}
	}
	
	override function peek(n):Token {
		if (n != 0) throw 'n != 0';
		var tok = super.peek(n);
		return switch(tok.tok) {
			case CommentLine(s):
				print('//$s');
				junk();
				newline();
				peek(0);
			case Comment(s):
				print('/*$s*');
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
			case Sharp(s = "if" | "elseif"):
				var count = 0;
				while(true) {
					var tok = super.peek(0);
					junk();
					preBuf.add(TokenDefPrinter.print(tok.tok));
					preBuf.add(" "); // TODO: this is not really correct
					switch(tok.tok) {
						case Sharp("end"):
							--count;
							if (count == 0) {
								return peek(0);
							}
						case Sharp("if"):
							++count;
						case _:
					}
				}
				throw 'Unclosed macro';
			case Sharp(s):
				print('#$s');
				junk();
				peek(0);
			case _:
				tok;
		}
	}
	
	function printModifier(modifier:Array<String>) {
		var order:Array<String> = cfg.modifier_order;
		modifier.sort(function(a,b) return order.indexOf(a) - order.indexOf(b));
		for (modifier in modifier) {
			print(modifier);
			print(" ");
		}
	}
	
	// general parsing
	
	function parseAnyIdent() {
		switch stream {
			case [{tok:Const(CIdent(s))}]:
				print(s);
			case [{tok:Kwd(KwdMacro)}]:
				print("macro");
			case [{tok:Kwd(KwdNew)}]:
				print("new");
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
		print("function ");
		parseAnyIdent();
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
				print(s);
		}
		popt(parseTypeHint);
		popt(parseAssignment.bind(cfg.space_around_function_arg_assign, cfg.space_around_function_arg_assign));
	}
	
	function parseModifier() {
		var modifier = [];
		while(true) {
			switch stream {
				case [{tok:Kwd(KwdStatic)}]:
					modifier.push("static");
				case [{tok:Kwd(KwdPublic)}]:
					modifier.push("public");
				case [{tok:Kwd(KwdPrivate)}]:
					modifier.push("private");
				case [{tok:Kwd(KwdExtern)}]:
					modifier.push("extern");
				case [{tok:Kwd(KwdInline)}]:
					modifier.push("inline");
				case [{tok:Kwd(KwdMacro)}]:
					modifier.push("macro");
				case _:
					return modifier;
			}
		}
	}
	
	// type declaration parsing
	
	function parseFile() {
		var modifier = parseModifier();
		switch stream {
			case [{tok:Kwd(KwdPackage)}]:
				print("package");
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
				print(kwd == KwdImport ? "import " : "using ");
				popt(parseDotPath);
				switch stream {
					case [{tok:Binop(OpMult)}]:
						print("*");
					case _:
				}
				switch stream {
					case [{tok:Kwd(KwdIn)}]:
						print(" in ");
						parseAnyIdent();
					case _:
				}
				semicolon();
				if (cfg.empty_line_after_import) {
					newline();
				}
			case [{tok:Kwd(kwd = KwdClass | KwdInterface)}]:
				newline();
				if (cfg.empty_line_before_type) {
					newline();
				}
				printModifier(modifier);
				print(kwd == KwdClass ? "class " : "interface ");
				parseAnyIdent();
				popt(parseTypeParameters);
				parseHeritance();
				brace(cfg.cuddle_type_braces);
				expect(BrOpen);
				moreTabs();
				parseClassFields(false);
			case [{tok:Kwd(KwdEnum)}]:
				newline();
				if (cfg.empty_line_before_type) {
					newline();
				}
				printModifier(modifier);
				print("enum ");
				parseAnyIdent();
				popt(parseTypeParameters);
				brace(cfg.cuddle_type_braces);
				expect(BrOpen);
				moreTabs();
				parseEnumFields(false);
			case [{tok:Kwd(KwdTypedef)}]:
				newline();
				if (cfg.empty_line_before_type) {
					newline();
				}
				printModifier(modifier);
				print("typedef ");
				parseAnyIdent();
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
		parseAnyIdent();
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
				}
		}
	}

	// class parsing
	
	function parseHeritance() {
		while(true) {
			switch stream {
				case [{tok:Kwd(KwdExtends)}]:
					if (cfg.extends_on_newline) {
						newline();
						print("\t");
					}
					print(" extends ");
					parseComplexType();
				case [{tok:Kwd(KwdImplements)}]:
					if (cfg.implements_on_newline) {
						newline();
						print("\t");
					}
					print(" implements ");
					parseComplexType();
				case _:
					break;
			}
		}
	}
	
	function parseClassFields(hadField:Bool) {
		var modifier = parseModifier();
		switch stream {
			case [{tok:Kwd(KwdVar)}]:
				if (cfg.empty_line_between_fields) {
					newline();
				}
				newline();
				printModifier(modifier);
				print("var ");
				parseAnyIdent();
				popt(parsePropertyAccessors);
				popt(parseTypeHint);
				popt(parseAssignment.bind(cfg.space_around_variable_assign, cfg.space_around_variable_assign));
				semicolon();
			case [{tok:Kwd(KwdFunction)}]:
				if (cfg.empty_line_between_fields) {
					newline();
				}
				newline();
				printModifier(modifier);
				print("function ");
				parseFunction();
				semicolon();
			case [{tok:BrClose}]:
				lessTabs();
				if (hadField) {
					newline();
				} else {
					space();
				}
				print("}");
				return;
		}
		parseClassFields(true);
	}
	
	function parsePropertyAccessors() {
		switch stream {
			case [{tok:POpen}, {tok:Const(CIdent(s1))}, {tok:Comma}, {tok:Const(CIdent(s2))}, {tok:PClose}]:
				print("(");
				print(s2);
				print(",");
				if (cfg.space_between_property_get_set) {
					print(" ");
				}
				print(s2);
				print(")");
		}
	}
	
	// enum parsing
	
	function parseEnumFields(hadField:Bool) {
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
		parseAnyIdent();
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
	
	// type parsing
	
	function parseDotPath() {
		switch stream {
			case [_ = parseAnyIdent()]:
		}
		popt(parseDotPathNext);
	}
	
	function parseDotPathNext() {
		switch stream {
			case [{tok:Dot}]:
				print(".");
				parseDotPath();
			case [{tok:Binop(OpLt)}]:
				print("<");
				psep(Comma, parseComplexType, withSpace(cfg.space_between_type_params));
				expect(Binop(OpGt));
		}
	}

	function parseComplexType() {
		switch stream {
			case [_ = parseDotPath()]:
			case [{tok:BrOpen}]:
				// TODO: config?
				print("{ ");
				psep(Comma, parseStructureTypeField, withSpace(cfg.space_after_structure_field_comma));
				expect(BrClose);
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
			case [{tok:BrClose}]:
				// TODO: config?
				space();
				print("}");
				return;
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
		parseExpr();
	}
	
	function parseBlockElements() {
		switch stream {
			case [{tok:BrClose}]:
				lessTabs();
				newline();
				print("}");
				return;
			case _:
		}
		newline();
		parseExpr();
		semicolon();
		parseBlockElements();
	}
	
	// TODO: this whole part is really awkward
	function parseBlockOrStructure() {
		switch stream {
			case [{tok:fieldToken = Const(CIdent(_) | CString(_))}]:
				switch stream {
					case [{tok:DblDot}]:
						// structure
						// TODO: config?
						print("{ ");
						print(TokenDefPrinter.print(fieldToken));
						if (cfg.space_before_structure_colon) {
							space();
						}
						print(":");
						if (cfg.space_after_structure_colon) {
							space();
						}
						parseExpr();
						psep(Comma, parseStructureElement, withSpace(cfg.space_after_structure_field_comma));
					case _:
						// block
						brace(cfg.cuddle_method_braces);
						print("{");
						moreTabs();
						newline();
						switch(fieldToken) {
							case Const(CIdent(s)):
								print(s);
							case Const(CString(s)):
								print('"$s"');
							case _:
								throw false;
						}
						parseExprNext();
						semicolon();
						parseBlockElements();
				}
			case [{tok:BrClose}]:
				print("{ }");
			case _:
				brace(cfg.cuddle_method_braces);
				print("{");
				moreTabs();
				parseBlockElements();
		}
	}
	
	function parseExpr() {
		switch stream {
			case [{tok:Const(CInt(s) | CFloat(s) | CIdent(s))}]:
				print(s);
			case [{tok:Const(CString(s))}]:
				print('"$s"');
			case [{tok:Kwd(KwdTrue)}]:
				print("true");
			case [{tok:Kwd(KwdFalse)}]:
				print("false");
			case [{tok:Kwd(KwdNull)}]:
				print("null");
			case [{tok:Kwd(KwdThis)}]:
				print("this");
			case [{tok:Kwd(KwdReturn)}]:
				print("return ");
				popt(parseExpr);
			case [{tok:BrOpen}]:
				parseBlockOrStructure();
			case[{tok:Kwd(KwdIf)}]:
				print("if ");
				expect(POpen);
				parseExpr();
				expect(PClose);
				space();
				parseExpr();
				semicolon();
				switch stream {
					case [{tok:Kwd(KwdElse)}]:
						print("else ");
						parseExpr();
					case _:
				}
			case [{tok:Kwd(KwdNew)}]:
				print("new ");
				parseDotPath();
				expect(POpen);
				psep(Comma, parseExpr, withSpace(cfg.space_between_function_args));
				expect(PClose);
			case [{tok:POpen}]:
				print("(");
				parseExpr();
				expect(PClose);
			case [{tok:Kwd(KwdFor)}]:
				print("for ");
				expect(POpen);
				parseExpr();
				expect(PClose);
				parseExpr();
			case [{tok:Unop(op)}]:
				print(new haxe.macro.Printer().printUnop(op));
				parseExpr();
			case [{tok:IntInterval(s)}]:
				print(s);
				print("...");
				parseExpr();
			case [{tok:Kwd(KwdSwitch)}]:
				print("switch ");
				parseExpr();
				space();
				expect(BrOpen);
				moreTabs();
				while(true) {
					switch stream {
						case [{tok:Kwd(KwdCase)}]:
							newline();
							print("case ");
							parseExpr();
							expect(DblDot);
							moreTabs();
							while(true) {
								switch(peek(0).tok) {
									case Kwd(KwdCase | KwdDefault) | BrClose:
										break;
									case _:
										newline();
										parseExpr();
										semicolon();
								}
							}
							lessTabs();
						case [{tok:Kwd(KwdDefault)}]:
							newline();
							print("default");
							expect(DblDot);
							parseBlockElements();
							semicolon();
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
			case [{tok:Binop(op)}]:
				space();
				print(new haxe.macro.Printer().printBinop(op));
				space();
				parseExpr();
				parseExprNext();
			case [{tok:Kwd(KwdIn)}]:
				space();
				print("in ");
				parseExpr();
				parseExprNext();
			case [{tok:BkOpen}]:
				print("[");
				parseExpr();
				expect(BkClose);
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
			throw 'Expected $tok but found ${peek(0)}';
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
}