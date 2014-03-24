package haxeprinter;

import haxe.macro.Expr;
import haxeparser.Data;
import haxeparser.HaxeLexer;

class Formatter extends hxparse.Parser<HaxeLexer, Token> implements hxparse.ParserBuilder
{
	var input:byte.ByteData;
	var buf = new StringBuf();
	var cfg:Config;
	var tabs:String = "";
	var lastChar:String = "";

	public function new(input:byte.ByteData, config:Config, sourceName:String)
	{
		super(new HaxeLexer(input, sourceName), HaxeLexer.tok);
		this.input = input;
		this.cfg = config;
	}

	function add(token:Token, ?style:Style, ?before:Spacing, ?after:Spacing)
	{
		var space = token.space;
		if (cfg.space.condense_multiple) space = ~/ +/.replace(space, ' ');
		if (cfg.newline.condense_multiple) space = ~/\n{3,}/.replace(space, '\n\n');
		space = ~/(^|\n)[\t ]{2,}/.replace(space, '$$1$tabs');
		var newline = space.indexOf('\n') > -1;

		if (before == null)
		{
			before = switch (token.tok)
			{
				case Dot | POpen | PClose | Const(_) | Const(CIdent(_)) | Kwd(KwdFalse) |
					Kwd(KwdTrue) | Kwd(KwdNull): SNone;
				case Semicolon | DblDot: SNone;
				default: SIgnore;
			}
		}
		if (before == SNone)
		{
			switch (token.tok)
			{
				case Kwd(_) | Const(CIdent(_)) | Kwd(KwdFalse) | Kwd(KwdTrue) | Kwd(KwdNull):
					if (~/\w/.match(lastChar)) before = SIgnore;
				default:
			}
		}
		if (after == null) after = SNone;

		space = switch (before)
		{
			case SSpace:
				// if (newline) space;
				// else
				if (lastChar == ' ') '';
				else ' ';
			case SNewline: '\n$tabs';
			case SNewlineIndented: '\n$tabs\t';
			case SIgnore: space;
			case SNone: newline ? space : '';
		}

		buf.add(space);
		var s = toString(token);

		#if js
		if (style != null)
		{
			var style = Std.string(style).substr(1).toLowerCase();
			buf.add('<span class="$style">$s</span>');
		}
		else buf.add(s);
		#else
		buf.add(s);
		#end

		if (after == SSpace)
		{
			buf.add(' ');
			lastChar = ' ';
		}
		else
		{
			lastChar = s.charAt(s.length - 1);
		}
		
	}

	function addLast(?style:Style, ?before:Spacing, ?after:Spacing)
	{
		add(last, style, before, after);
	}

	function addNext(?style:Style, ?before:Spacing, ?after:Spacing)
	{
		add(super.peek(0), style, before, after);
		junk();
	}

	function toString(token:Token)
	{
		return switch(token.tok)
		{
			case Kwd(k): k.getName().substr(3).toLowerCase();
			case Const(CInt(s) | CFloat(s) | CIdent(s)): s;
			case Const(CString(s)):
				var c = input.readString(token.pos.min, 1);
				'$c$s$c';
			case Const(CRegexp(r, opt)): '~/$r/$opt';
			case Sharp(s): '#$s';
			case Dollar(s): '$$$s';
			case Unop(op): new haxe.macro.Printer("").printUnop(op);
			case Binop(op): new haxe.macro.Printer("").printBinop(op);
			case Comment(s): '/*$s*/';
			case CommentLine(s): '//$s';
			case IntInterval(s): '$s...';
			case Semicolon: ';';
			case Dot: '.';
			case DblDot: ':';
			case Arrow: '->';
			case Comma: ',';
			case BkOpen: '[';
			case BkClose: ']';
			case BrOpen: '{';
			case BrClose: '}';
			case POpen: '(';
			case PClose: ')';
			case Question: '?';
			case At: '@';
			case Eof: '<eof>';
		}
	}
	
	public function getContent()
	{
		parseFile();
		var output = StringTools.trim(buf.toString());
		if (cfg.newline.empty_at_end_of_file) output += '\n';
		return output;
	}

	function moreTabs() {
		tabs += "\t";
	}
	
	function lessTabs() {
		tabs = tabs.substr(1);
	}
	
	override function peek(n):Token
	{
		if (n != 0) throw 'n != 0';
		var tok = super.peek(n);
		return switch (tok.tok)
		{
			case CommentLine(s), Comment(s):
				addNext(SComment);
				peek(0);
			case Sharp("error"):
				addNext(SMacro);
				switch (peek(0).tok)
				{
					case Const(CString(s)):
						add(peek(0), SString);
						junk();
					case _:
						throw "String expected";
				}
				peek(0);
			case Sharp(s = "if" | "elseif"):
				addNext(SMacro);
				skipMacroCond();
				peek(0);
			case Sharp(_):
				addNext(SMacro);
				peek(0);
			case _:
				tok;
		}
	}
	
	function skipMacroCond()
	{
		switch (super.peek(0).tok)
		{
			case Const(CIdent(_)) | Kwd(_):
				addNext(SMacro);
			case POpen:
				var pCount = 0;
				while(true) {
					switch super.peek(0).tok {
						case POpen:
							++pCount;
							addNext(SMacro);
						case PClose:
							--pCount;
							addNext(SMacro);
							if (pCount == 0) return;
						case tok:
							addNext(SMacro);
					}
				}
			case Unop(OpNot):
				addNext(SMacro);
				skipMacroCond();
			case tok:
				throw 'Invalid macro cond: $tok';
		}
	}
	
	// general parsing
	
	function parseTypeHint() {
		switch stream {
			case [{tok:DblDot}]:
				addLast(spaceIf(cfg.space.before.type_hint_colon), spaceIf(cfg.space.after.type_hint_colon));
				parseComplexType();
		}
	}
	
	function parseAssignment() {
		switch stream {
			case [{tok:Binop(OpAssign)}]:
				var around = spaceIf(cfg.space.around.assignment_operators);
				addLast(null, around, around);
				parseExpr();
		}
	}
	
	function parseFunction() {
		addLast(SKwd);
		popt(parseAnyIdent.bind(null, SSpace));
		popt(parseTypeParameters);
		expect(POpen, null, spaceIf(cfg.space.before.method_declaration_parenthesis), spaceIf(cfg.space.within.method_declaration_parenthesis));
		psep(Comma, parseFunctionArgument, null, spaceIf(cfg.space.between.function_arguments));
		expect(PClose, spaceIf(cfg.space.within.method_declaration_parenthesis));
		popt(parseTypeHint);
		popt(parseExpr.bind(spaceOrNewline(cfg.newline.before_brace, cfg.space.before.method_left_brace), null));
	}

	function parseFunctionArgument() {
		switch stream {
			case [{tok:Question}]:
				addLast();
			case _:
		}
		switch stream {
			case [{tok:Const(CIdent(s))}]:
				addLast(SIdent);
		}
		popt(parseTypeHint);
		popt(parseAssignment);
	}
	
	function parseModifier() {
		while(true) {
			switch stream {
				case [{tok:Kwd(k = KwdStatic | KwdPublic | KwdPrivate | KwdExtern | KwdInline | KwdMacro | KwdDynamic | KwdOverride)}]:
					addLast(SKwd);
				case _:
					return;
			}
		}
	}
	
	function parseCallArguments() {
		switch stream {
			case [{tok:POpen}]:
				addLast();
				psep(Comma, parseExpr.bind(null, null), null, spaceIf(cfg.space.between.call_arguments));
				expect(PClose);
		}
	}
	
	function parseMetaName() {
		switch stream {
			case [{tok:DblDot}]:
				addLast();
			case _:
		}
		switch stream {
			case [{tok:Const(CIdent(s))}]:
				addLast(SIdent);
			case [{tok:Kwd(kwd)}]:
				addLast(SKwd);
		}
	}
	
	function parseMeta() {
		switch stream {
			case [{tok:At}]:
				addLast();
				parseMetaName();
				popt(parseCallArguments);
				parseMeta();
			case _:
				return;
		}
	}
	
	// type declaration parsing
	
	function parseFile()
	{
		parseMeta();
		parseModifier();

		switch stream {
			case [{tok:Kwd(KwdPackage)}]:
				addLast(SDecl);
				if (peek(0).tok == Semicolon) {
					add(peek(0));
					junk();
				} else {
					parseDotPath();
					expect(Semicolon);
				}
			case [{tok:Kwd(kwd = KwdImport | KwdUsing)}]:
				addLast(SDecl);
				popt(parseDotPath);
				switch stream {
					case [{tok:Binop(OpMult)}]:
						addLast(SType);
					case _:
				}
				switch stream {
					case [{tok:Kwd(KwdIn)}]:
						addLast(SDecl);
						parseAnyIdent(SType);
					case _:
				}
				semicolon();
			case [{tok:Kwd(kwd = KwdClass | KwdInterface)}]:
				addLast(SDecl);
				parseAnyIdent(SType, SSpace);
				popt(parseTypeParameters);
				parseHeritance();
				expect(BrOpen, spaceOrNewline(cfg.newline.before_brace, true));
				moreTabs();
				parseClassFields(false);
				
			case [{tok:Kwd(KwdEnum)}]:
				addLast(SDecl);
				parseAnyIdent(SType, SSpace);
				popt(parseTypeParameters);

				expect(BrOpen, spaceOrNewline(cfg.newline.before_brace, true));
				moreTabs();
				parseEnumFields(false);

			case [{tok:Kwd(KwdTypedef)}]:
				addLast(SDecl);
				parseAnyIdent(SType);
				popt(parseTypeParameters);
				expect(Binop(OpAssign));
				parseComplexType();
				semicolon();
			case [{tok:Kwd(KwdAbstract)}]:
				addLast(SDecl);
				parseAnyIdent(SType);
				popt(parseTypeParameters);
				popt(parseAbstractThis);
				popt(parseAbstractRelations);

				expect(BrOpen, spaceOrNewline(cfg.newline.before_brace, true));
				moreTabs();
				parseEnumFields(false);
			case [{tok:Eof}]:
				return;
		}
		parseFile();
	}
	
	function parseTypeParameters() {
		switch stream {
			case [{tok:Binop(OpLt)}]:
				addLast();
				psep(Comma, parseTypeParameter, null, spaceIf(cfg.space.between.type_parameters));
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
				addLast();
				switch stream {
					case [{tok:POpen}]:
						addLast();
						psep(Comma, parseComplexType, null, spaceIf(cfg.space.between.type_constraints));
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
					addLast(SDecl, cfg.newline.before_extends ? SNewlineIndented : SSpace, SSpace);
					parseComplexType();
				case [{tok:Kwd(KwdImplements)}]:
					addLast(SDecl, cfg.newline.before_implements ? SNewlineIndented : SSpace, SSpace);
					parseComplexType();
				case _: break;
			}
		}
	}
	
	function parseClassFields(hadField:Bool) {
		parseMeta();
		parseModifier();
		switch stream {
			case [{tok:Kwd(KwdVar)}]:
				addLast(SKwd);
				parseAnyIdent(SSpace);
				popt(parsePropertyAccessors);
				popt(parseTypeHint);
				popt(parseAssignment);
				semicolon();
			case [{tok:Kwd(KwdFunction)}]:
				parseFunction();
				semicolon();
			case [{tok:BrClose}]:
				lessTabs();
				addLast();
				return;
		}
		parseClassFields(true);
	}
	
	function parsePropertyIdent() {
		switch stream {
			case [_ = parseAnyIdent(SKwd, SNone, SNone)]:
			case [{tok:Kwd(KwdNull | KwdDynamic | KwdDefault)}]:
				addLast(SKwd, SNone, SNone);
		}
	}
	
	function parsePropertyAccessors() {
		switch stream {
			case [{tok:POpen}]:
				addLast();
				parsePropertyIdent();
				expect(Comma, SNone, SSpace);
				parsePropertyIdent();
				expect(PClose);
		}
	}
	
	
	// enum parsing
	
	function parseEnumFields(hadField:Bool) {
		parseMeta();
		switch stream {
			case [{tok: BrClose}]:
				addLast();
				return;
			case _:
		}
		parseAnyIdent(SType);
		popt(parseTypeParameters);
		switch stream {
			case [{tok:POpen}]:
				addLast();
				psep(Comma, parseFunctionArgument, null, spaceIf(cfg.space.between.enum_arguments));
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
				addLast();
				parseComplexType();
				expect(PClose);
		}
	}
	
	function parseAbstractRelations() {
		switch stream {
			case [{tok:Const(CIdent(s = "from" | "to"))}]:
				addLast(SDecl);
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
				addLast(SType);
				parseDotPath();
			case [{tok:Binop(OpLt)}]:
				addLast();
				psep(Comma, parseComplexType, null, spaceIf(cfg.space.between.type_parameters));
				expect(Binop(OpGt));
		}
	}
	
	function parseStructureFields() {
		switch stream {
			case [_ = parseClassFields(false)]:
			case [ _ = psep(Comma, parseStructureTypeField)]:
				expect(BrClose);
		}
	}

	function parseComplexType() {
		switch stream {
			case [_ = parseDotPath()]:
			case [{tok:POpen}]:
				addLast();
				parseComplexType();
				expect(PClose);
			case [{tok:BrOpen}]:
				addLast();
				switch stream {
					case [{tok:Binop(OpGt)}]:
						addLast();
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
				var around = spaceIf(cfg.space.around.arrow);
				addLast(SKwd, around, around);
				parseComplexType();
		}
	}
	
	function parseStructureTypeField() {
		switch stream {
			case [{tok:Question}]:
				addLast();
			case _:
		}
		parseAnyIdent();
		expect(DblDot);
		parseComplexType();
	}
	
	// expression parsing
	
	function parseStructureElement() {
		switch stream {
			case [_ = parseAnyIdent()]:
			case [{tok:Const(CString(s)), pos:p}]:
				addLast();
		}
		expect(DblDot);
		parseExpr();
	}
	
	function parseVarDeclaration() {
		parseAnyIdent(SSpace);
		popt(parseTypeHint);
		popt(parseAssignment);
	}
	
	function parseMacroExpr() {
		switch stream {
			case [{tok:DblDot}]:
				addLast(spaceIf(cfg.space.before.type_hint_colon), spaceIf(cfg.space.after.type_hint_colon));
				parseComplexType();
			case [{tok:Kwd(KwdVar)}]:
				addLast(SKwd);
				psep(Comma, parseVarDeclaration, null, spaceIf(cfg.space.between.var_declarations));
			case [_ = parseExpr()]:
		}
	}
	
	function parseCatch() {
		switch stream {
				expect(POpen, null, spaceIf(cfg.space.before.catch_parenthesis), spaceIf(cfg.space.within.catch_parenthesis));
				parseAnyIdent();
				expect(DblDot);
				parseComplexType();
				expect(PClose, spaceIf(cfg.space.within.catch_parenthesis));
				parseExpr(spaceOrNewline(cfg.newline.before_brace, cfg.space.before.catch_left_brace));
		}
	}
	
	// parsing helper
	
	function spaceIf(flag:Bool)
	{
		return flag ? SSpace : SNone;
	}

	function spaceOrNewline(newline:Bool, space:Bool)
	{
		return newline ? SNewline : spaceIf(space);
	}

	function semicolon() {
		switch stream {
			case [{tok:Semicolon}]:
				addLast();
			case _ if (last.tok == BrClose):
		}
	}
	
	function expect(tok:TokenDef, ?style:Style, ?before:Spacing, ?after:Spacing)
	{
		if (!Type.enumEq(peek(0).tok, tok)) {
			throw (curPos().format(input)) + ':Expected $tok but found ${peek(0)}';
		}
		addNext(style, before, after);
	}
	
	function popt<T>(f:Void->T):Null<T> {
		return switch stream {
			case [v = f()]: v;
			case _: null;
		}
	}
	
	function psep<T>(sep:TokenDef, f:Void->T, ?before:Spacing, ?after:Spacing) {
		while(true) {
			try {
				f();
				var tok = peek(0);
				if (tok.tok == sep) {
					add(tok, null, before, after);
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
			while(true) f();
		} catch(e:hxparse.NoMatch<Dynamic>) {}
	}
}

enum Spacing
{
	SSpace;
	SNewline;
	SNewlineIndented;
	SIgnore;
	SNone;
}
