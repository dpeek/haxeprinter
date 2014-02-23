package haxeprinter;

import haxe.macro.Expr;
import haxeparser.Data;
import haxeparser.HaxeLexer;

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
	
	function printString(s:String, pos:Position) {
		// TODO: interpolation formatting?
		var c = input.readString(pos.min, 1);
		print('$c$s$c');
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
				print('/*$s*/');
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
				print("#error ");
				switch(peek(0).tok) {
					case Const(CString(s)):
						junk();
						print('"$s"');
					case _:
						throw "String expected";
				}
				peek(0);
			case Sharp("if"):
				print("#if ");
				junk();
				skipMacroCond();
				peek(0);
			case Sharp("#end"):
				print("#end");
				junk();
				peek(0);
			case Sharp(s = "elseif" | "else"):
				print('#$s');
				var count = 1;
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
	
	function skipMacroCond() {
		switch super.peek(0).tok {
			case tok = Const(CIdent(_)) | Kwd(_):
				print(TokenDefPrinter.print(tok));
				junk();
			case POpen:
				var pCount = 0;
				while(true) {
					switch super.peek(0).tok {
						case POpen:
							++pCount;
							junk();
							print("(");
						case PClose:
							--pCount;
							junk();
							print(")");
							if (pCount == 0) {
								return;
							}
						case tok:
							junk();
							print(TokenDefPrinter.print(tok));
					}
				}
			case Unop(OpNot):
				print("!");
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
			case [{tok:Dollar(s)}]:
				print("$" +s);
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
		popt(parseAnyIdent);
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
				case [{tok:Kwd(KwdDynamic)}]:
					modifier.push("dynamic");
				case [{tok:Kwd(KwdOverride)}]:
					modifier.push("override");
				case _:
					return modifier;
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
				print(s);
			case [{tok:Kwd(kwd)}]:
				print(kwd.getName().substr(3).toLowerCase());
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
		parseMeta();
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
			case [{tok:Kwd(KwdAbstract)}]:
				newline();
				if (cfg.empty_line_before_type) {
					newline();
				}
				printModifier(modifier);
				print("abstract ");
				parseAnyIdent();
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
					case [_ = parseComplexType()]:
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
		parseMeta();
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
				popt(parseAssignment.bind(cfg.space_around_property_assign, cfg.space_around_property_assign));
				semicolon();
			case [{tok:Kwd(KwdFunction)}]:
				if (cfg.empty_line_between_fields) {
					newline();
				}
				newline();
				printModifier(modifier);
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
	
	function parsePropertyIdent() {
		switch stream {
			case [_ = parseAnyIdent()]:
			case [{tok:Kwd(KwdDefault)}]:
				print("default");
			case [{tok:Kwd(KwdNull)}]:
				print("null");
			case [{tok:Kwd(KwdDynamic)}]:
				print("dynamic");
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
				print(s);
				parseComplexType();
				parseAbstractRelations();
		}
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
	
	function parseStructureFields() {
		switch stream {
			case [_ = parseClassFields(false)]:
			case [ _ = psep(Comma, parseStructureTypeField, withSpace(cfg.space_between_anon_type_fields))]:
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
				print("var ");
				psep(Comma, parseVarDeclaration, withSpace(true)); // TODO
			case [_ = parseExpr()]:
		}
	}
	
	function parseCatch() {
		switch stream {
			case [{tok:Kwd(KwdCatch)}]:
				print("catch ");
				expect(POpen);
				parseAnyIdent();
				expect(DblDot);
				parseComplexType();
				expect(PClose);
				parseExpr();
		}
	}
	
	function parseBlockElement() {
		switch stream {
			case [{tok:Kwd(KwdVar)}]:
				print("var ");
				psep(Comma, parseVarDeclaration, withSpace(true)); // TODO: config?
				semicolon();
			case [_ = parseExpr()]:
				semicolon();
		}
	}
	
	// TODO: this whole part is really awkward
	function parseBlockOrStructure() {
		switch stream {
			case [{tok:fieldToken = Const(CIdent(_) | CString(_)), pos:p}]:
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
						brace(cfg.cuddle_method_braces);
						print("{");
						moreTabs();
						newline();
						switch(fieldToken) {
							case Const(CIdent(s)):
								print(s);
							case Const(CString(s)):
								printString(s, p);
							case _:
								throw false;
						}
						parseExprNext();
						semicolon();
						plist(parseBlockElement);
						expect(BrClose);
				}
			case [{tok:BrClose}]:
				print("{ }");
			case _:
				brace(cfg.cuddle_method_braces);
				print("{");
				moreTabs();
				newline();
				plist(parseBlockElement);
				lessTabs();
				newline();
				expect(BrClose);
		}
	}

	function parseExpr() {
		parseMeta();
		switch stream {
			case [{tok:Const(CInt(s) | CFloat(s) | CIdent(s))}]:
				print(s);
			case [{tok:Const(CString(s)), pos:p}]:
				printString(s, p);
			case [{tok:Const(CRegexp(p, o))}]:
				print('~/$p/$o');
			case [{tok:Kwd(KwdTrue)}]:
				print("true");
			case [{tok:Kwd(KwdFalse)}]:
				print("false");
			case [{tok:Kwd(KwdNull)}]:
				print("null");
			case [{tok:Kwd(KwdThis)}]:
				print("this");
			case [{tok:Kwd(KwdUntyped)}]:
				print("untyped ");
				parseExpr();
			case [{tok:Kwd(KwdMacro)}]:
				print("macro ");
				parseMacroExpr();
			case [{tok:Dollar(s)}]:
				print("$" +s);
				switch stream {
					case [{tok:BrOpen}]:
						print("{");
						parseExpr();
						expect(BrClose);
					case _:
				}
			case [{tok:Kwd(KwdBreak)}]:
				print("break");
			case [{tok:Kwd(KwdContinue)}]:
				print("continue");
			case [{tok:Kwd(KwdFunction)}]:
				parseFunction();
			case [{tok:Kwd(KwdReturn)}]:
				print("return ");
				popt(parseExpr);
			case [{tok:Kwd(KwdThrow)}]:
				print("throw ");
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
				print("var ");
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
					case _:
						unexpected();
				}
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
			case [{tok:Kwd(KwdFor)}]:
				print("for "); // TODO: space config?
				expect(POpen);
				parseExpr();
				expect(PClose);
				parseExpr();
			case [{tok:Kwd(KwdWhile)}]:
				print("while "); // TODO: space config?
				expect(POpen);
				parseExpr();
				expect(PClose);
				parseExpr();
			case [{tok:Kwd(KwdDo)}]:
				print("do "); // TODO: config?
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
				print("try ");
				parseExpr();
				plist(parseCatch);
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
							psep(Comma, parseExpr, withSpace(true)); // TODO: config?
							switch stream  {
								case [{tok:DblDot}]:
									print(": ");
								case [{tok:Kwd(KwdIf)}]:
									print("if ");
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
							print("default");
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
				print("in ");
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