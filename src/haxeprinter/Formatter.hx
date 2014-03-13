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
		if (after == null) after = SNone;

		if (cfg.condense_multiple_spaces) space = ~/ +/.replace(space, ' ');
		if (cfg.condense_multiple_empty_lines) space = ~/\n{3,}/.replace(space, '\n\n');

		var newline = space.indexOf('\n') > -1;
		space = switch (before)
		{
			case SSpace:
				if (newline) space;
				else if (lastChar == ' ') '';
				else ' ';
			case SNewline: '\n';
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
		if (cfg.empty_line_at_end_of_file) output += '\n';
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
	
	function parseAnyIdent(?style:Style, ?before:Spacing, ?after:Spacing) {
		switch stream {
			case [{tok:Const(CIdent(_)) | Kwd(KwdMacro | KwdNew) | Dollar(_)}]:
				addLast(style, before, after);
		}
	}
	
	function parseTypeHint() {
		switch stream {
			case [{tok:DblDot}]:
				addLast();
				parseComplexType();
		}
	}
	
	function parseAssignment() {
		switch stream {
			case [{tok:Binop(OpAssign)}]:
				var around = spaceIf(cfg.space_around_assignment_operators);
				addLast(null, around, around);
				parseExpr();
		}
	}
	
	function parseFunction() {
		addLast(SKwd);
		popt(parseAnyIdent.bind(null, SSpace));
		popt(parseTypeParameters);
		expect(POpen, null, spaceIf(cfg.space_before_method_declaration_parenthesis));
		psep(Comma, parseFunctionArgument);
		expect(PClose);
		popt(parseTypeHint);
		popt(parseExpr.bind(spaceIf(cfg.space_before_method_left_brace), null));
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
				psep(Comma, parseExpr.bind(null, null));
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
				expect(BrOpen);
				moreTabs();
				parseClassFields(false);
			case [{tok:Kwd(KwdEnum)}]:
				addLast(SDecl);
				parseAnyIdent(SType);
				popt(parseTypeParameters);

				expect(BrOpen);
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

				expect(BrOpen);
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
				psep(Comma, parseTypeParameter);
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
						psep(Comma, parseComplexType);
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
					addLast(SDecl);
					parseComplexType();
				case [{tok:Kwd(KwdImplements)}]:
					addLast(SDecl);
					parseComplexType();
				case _:
					break;
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
				psep(Comma, parseFunctionArgument);
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
				psep(Comma, parseComplexType);
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
				addLast();
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
				addLast();
				parseComplexType();
			case [{tok:Kwd(KwdVar)}]:
				addLast(SKwd);
				psep(Comma, parseVarDeclaration);
			case [_ = parseExpr()]:
		}
	}
	
	function parseCatch() {
		switch stream {
			case [{tok:Kwd(KwdCatch)}]:
				addLast(SKwd, spaceIf(cfg.space_before_catch_keyword));
				expect(POpen, null, spaceIf(cfg.space_before_catch_parenthesis));
				parseAnyIdent();
				expect(DblDot);
				parseComplexType();
				expect(PClose);
				parseExpr(spaceIf(cfg.space_before_catch_left_brace));
		}
	}
	
	function parseBlockElement() {
		switch stream {
			case [{tok:Kwd(KwdVar)}]:
				addLast(SKwd);
				psep(Comma, parseVarDeclaration);
				semicolon();
			case [_ = parseExpr()]:
				semicolon();
		}
	}
	
	// TODO: this whole part is really awkward
	function parseBlockOrStructure(?before:Spacing, ?after:Spacing)
	{
		addLast(null, before);
		moreTabs();

		switch stream {
			case [{tok:Const(CIdent(_) | CString(_)), pos:p}]:
				var fieldToken = last;
				switch stream {
					case [{tok:DblDot}]:
						// structure
						add(fieldToken, SIdent);
						addLast();
						parseExpr();
						switch stream {
							case [{tok:Comma}]:
								addLast();
								psep(Comma, parseStructureElement);
								expect(BrClose);
							case [{tok:BrClose}]:
								lessTabs();
								addLast();
							case _:
								unexpected();
						}
					case _:
						// block
						switch (fieldToken.tok) {
							case Const(CIdent(s)):
								add(fieldToken, SIdent);
							case Const(CString(s)):
								add(fieldToken, SString);
							case _:
								throw false;
						}
						parseExprNext();
						semicolon();
						plist(parseBlockElement);
						lessTabs();
						expect(BrClose);
				}
			case [{tok:BrClose}]:
				addLast();
			case _:
				// moreTabs();
				plist(parseBlockElement);
				lessTabs();
				expect(BrClose);
		}
	}

	function parseExpr(?before:Spacing, ?after:Spacing)
	{
		parseMeta();
		switch stream {
			case [{tok:Const(CInt(s) | CFloat(s))}]:
				addLast(SConst);
			case [{tok:Const(CIdent(s))}]:
				addLast(SIdent);
			case [{tok:Const(CString(s)), pos:p}]:
				addLast(SString);
			case [{tok:Const(CRegexp(p, o))}]:
				addLast(SConst);
			case [{tok:Kwd(KwdTrue)}]:
				addLast(SConst);
			case [{tok:Kwd(KwdFalse)}]:
				addLast(SConst);
			case [{tok:Kwd(KwdNull)}]:
				addLast(SConst);
			case [{tok:Kwd(KwdThis)}]:
				addLast(SDecl);
			case [{tok:Kwd(KwdUntyped)}]:
				addLast(SKwd);
				parseExpr();
			case [{tok:Kwd(KwdMacro)}]:
				addLast(SKwd);
				parseMacroExpr();
			case [{tok:Dollar(s)}]:
				addLast(SKwd);
				switch stream {
					case [{tok:BrOpen}]:
						addLast();
						parseExpr();
						expect(BrClose);
					case _:
				}
			case [{tok:Kwd(KwdBreak)}]:
				addLast(SKwd);
			case [{tok:Kwd(KwdContinue)}]:
				addLast(SKwd);
			case [{tok:Kwd(KwdFunction)}]:
				parseFunction();
			case [{tok:Kwd(KwdReturn)}]:
				addLast(SKwd);
				popt(parseExpr.bind(null, null));
			case [{tok:Kwd(KwdThrow)}]:
				addLast(SKwd);
				parseExpr();
			case [{tok:Kwd(KwdCast)}]:
				switch stream {
					case [{tok:POpen}]:
						addLast();
						parseExpr();
						switch stream {
							case [{tok:Comma}]:
								addLast();
								parseComplexType();
							case _:
						}
						expect(PClose);
					case [_ = parseExpr()]:
				}
			case [{tok:Kwd(KwdVar)}]:
				addLast(SKwd);
				parseVarDeclaration();
			case [{tok:Binop(OpSub)}]:
				addLast();
				parseExpr();
			case [{tok:BrOpen}]:
				parseBlockOrStructure(before, after);
			case [{tok:BkOpen}]:
				addLast();
				psep(Comma, parseExpr.bind(null, null));
				expect(BkClose);
			case [{tok:POpen}]:
				addLast();
				parseExpr();
				switch stream {
					case [{tok:DblDot}]:
						addLast();
						parseComplexType();
						expect(PClose);
					case [{tok:PClose}]:
						addLast();
					case _:
						unexpected();
				}
			case[{tok:Kwd(KwdIf)}]:
				addLast(SKwd);
				expect(POpen, null, spaceIf(cfg.space_before_if_parenthesis));
				parseExpr();
				expect(PClose);
				parseExpr(spaceIf(cfg.space_before_if_left_brace));
				semicolon();
				switch stream {
					case [{tok:Kwd(KwdElse)}]:
						addLast(SKwd, spaceIf(cfg.space_before_else_keyword));
						parseExpr(spaceIf(cfg.space_before_else_left_brace));
					case _:
				}
			case [{tok:Kwd(KwdNew)}]:
				addLast(SKwd);
				parseDotPath();
				expect(POpen);
				psep(Comma, parseExpr.bind(null, null));
				expect(PClose);
			case [{tok:Kwd(KwdFor)}]:
				addLast(SKwd);
				expect(POpen, null, spaceIf(cfg.space_before_for_parenthesis));
				parseExpr(spaceIf(cfg.space_before_for_left_brace));
				expect(PClose);
				parseExpr();
			case [{tok:Kwd(KwdWhile)}]:
				addLast(SKwd, spaceIf(cfg.space_before_while_keyword));
				expect(POpen, null, spaceIf(cfg.space_before_while_parenthesis));
				parseExpr();
				expect(PClose);
				parseExpr(spaceIf(cfg.space_before_while_left_brace));
			case [{tok:Kwd(KwdDo)}]:
				addLast(SKwd);
				parseExpr(spaceIf(cfg.space_before_while_left_brace));
				expect(Kwd(KwdWhile), SKwd, spaceIf(cfg.space_before_while_keyword));
				expect(POpen, null, spaceIf(cfg.space_before_while_parenthesis));
				parseExpr();
				expect(PClose);
			case [{tok:Unop(op)}]:
				addLast(null, spaceIf(cfg.space_around_unary_operators));
				parseExpr();
			case [{tok:IntInterval(s)}]:
				addLast();
				parseExpr();
			case [{tok:Kwd(KwdTry)}]:
				addLast(SKwd);
				parseExpr(spaceIf(cfg.space_before_try_left_brace));
				plist(parseCatch);
			case [{tok:Kwd(KwdSwitch)}]:
				addLast(SKwd, null, spaceIf(cfg.space_before_switch_parenthesis));
				parseExpr();
				expect(BrOpen, null, spaceIf(cfg.space_before_switch_left_brace));
				moreTabs();
				while(true) {
					switch stream {
						case [{tok:Kwd(KwdCase)}]:
							addLast(SKwd);
							psep(Comma, parseExpr.bind(null, null));
							switch stream  {
								case [{tok:DblDot}]:
									addLast();
								case [{tok:Kwd(KwdIf)}]:
									addLast(SKwd);
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
										parseBlockElement();
								}
							}
							lessTabs();
						case [{tok:Kwd(KwdDefault)}]:
							addLast(SKwd);
							expect(DblDot);
							moreTabs();
							while(true) {
								switch(peek(0).tok) {
									case BrClose:
										break;
									case _:
										parseBlockElement();
								}
							}
							lessTabs();
						case [{tok:BrClose}]:
							addLast();
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
				addLast(null, spaceIf(cfg.space_before_method_call_parenthesis));
				psep(Comma, parseExpr.bind(null, null));
				expect(PClose);
				parseExprNext();
			case [{tok:Dot}]:
				addLast();
				parseAnyIdent();
				parseExprNext();
			case [{tok:Binop(OpGt)}]:
				addLast();
				while(true) {
					switch stream {
						case [{tok:Binop(OpGt)}]:
							addLast();
						case [{tok:Binop(OpAssign)}]:
							addLast();
						case _:
							parseExpr();
							parseExprNext();
							break;
					}
				}
			case [{tok:Binop(op)}]:
				var around = switch (op)
				{
					case OpAssignOp(_):
						spaceIf(cfg.space_around_assignment_operators);
					case OpBoolAnd | OpBoolOr:
						spaceIf(cfg.space_around_logical_operators);
					case OpEq | OpNotEq:
						spaceIf(cfg.space_around_equality_operators);
					case OpLt | OpGt | OpGte | OpLte:
						spaceIf(cfg.space_around_relational_operators);
					case OpAdd | OpSub:
						spaceIf(cfg.space_around_additive_operators);
					case OpMult | OpDiv | OpMod:
						spaceIf(cfg.space_around_multiplicative_operators);
					default:
						null;
				}
				addLast(null, around, around);
				parseExpr();
				parseExprNext();
			case [{tok:Kwd(KwdIn)}]:
				addLast(SKwd);
				parseExpr();
				parseExprNext();
			case [{tok:BkOpen}]:
				addLast();
				parseExpr();
				expect(BkClose);
				parseExprNext();
			case [{tok:Question}]:
				addLast();
				parseExpr();
				expect(DblDot);
				parseExpr();
				parseExprNext();
			case [{tok:Unop(op)}]:
				addLast(null, spaceIf(cfg.space_around_unary_operators));
				parseExprNext();
			case _:
		}
	}
	
	// parsing helper
	
	function spaceIf(flag:Bool)
	{
		return flag ? SSpace : SNone;
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
	
	function psep<T>(sep:TokenDef, f:Void->T) {
		while(true) {
			try {
				f();
				var tok = peek(0);
				if (tok.tok == sep) {
					add(tok);
					// fSep();
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
	SIgnore;
	SNone;
}
