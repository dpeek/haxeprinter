package haxeprinter;

import haxe.io.Input;
import haxe.macro.Expr;
import haxe.ds.GenericStack;
import haxeparser.Data;
import haxeparser.HaxeLexer;
import haxeprinter.Style;
using Lambda;

enum State
{
	STopLevel;
	SMeta;
	SModifier;
	SPackage;
	SImport;
	SExtends;
	SImplements;
	SUsing;
	SClass;
	STypeDef;
	SAbstract;
	SEnum;
	STypePath;
	STypeParams;
	SProperty;
	SMethod;
	SExpr;
	SExprNext;
	SMacroExpr;
	SUntyped;
	SComplexType;
	SDollar;
	SFunction;
	SThrow;
	SReturn;
	SCast;
	SVarDecl;
	SNegative;
	SBlockOrStructure;
	SBlock;
	SStructure;
	SArray;
	SGroup;
	SIf;
	SElse;
	SFor;
	SWhile;
	SDo;
	SUnop;
	SNew;
	SInterval;
	STry;
	SCatch;
	SSwitch;
	SCase;
	SDefault;
	SBlockElement;
	SStructureElement;
	SCall;
}

enum Pattern
{
	PTok(tok:TokenDef);
	PState(state:State);
	POr(pats:Array<Pattern>);
	PList(pat:Pattern);
	PSep(pat:Pattern, sep:Pattern);
	PSeq(pats:Array<Pattern>);
	POpt(pat:Pattern);
	PMatch;
	PNoMatch;
}

typedef PrintToken = { before:String, after:String, style:Style, tok:TokenDef, pos:Position }

class Printer
{
	static function toString(token:PrintToken, input:byte.ByteData)
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
			case Eof: '';
		}
	}

	static function main()
	{
		var printer = new Printer(byte.ByteData.ofString('1 + (1 - 2)'), cast {}, 'test');
		printer.test();
	}

	var lexer:HaxeLexer;
	var cfg:Config;

	var buf = new StringBuf();
	var stream = new Array<PrintToken>();
	var saved = new GenericStack<GenericStack<State>>();
	var input:byte.ByteData;

	public function new(input:byte.ByteData, config:Config, sourceName:String)
	{
		this.lexer = new HaxeLexer(input, sourceName);
		this.input = input;
		this.cfg = config;
	}

	function rawToken()
	{
		var tk = lexer.token(HaxeLexer.tok);
		var style = switch (tk.tok)
		{
			case Const(CIdent(_)): Style.SIdent;
			case Const(CString(s)): Style.SString;
			case Const(_): Style.SConst;
			case Kwd(_): SKwd;
			case _: SNormal;
		}
		var ptk = { before:tk.space, after:'', tok:tk.tok,  pos:tk.pos, style:style }
		add(ptk);
		return ptk;
	}

	function token()
	{
		return rawToken();

		// var tk = rawToken();
		// return switch (tk.tok)
		// {
		// 	case CommentLine(_) | Comment(_):
		// 		token();
		// 	case Sharp('if'):
		// 		save();
		// 		skipMacroCond();
		// 	case Sharp('elseif'):
		// 		restore();
		// 		skipMacroCond();
		// 	case Sharp('else'):
		// 		restore();
		// 		token();
		// 	case Sharp('end'):
		// 		end();
		// 		token();
		// 	case _: tk;
		// }
	}

	function add(tk:PrintToken)
	{
		// log(tk.tok);
		stream.push(tk);
	}

	function skipMacroCond()
	{
		var tk = rawToken();

		switch (tk.tok)
		{
			case Const(CIdent(_)) | Kwd(_):
				return token();
			case POpen:
				var pCount = 1;
				while (true)
				{
					var tk = rawToken();
					switch (tk.tok)
					{
						case POpen:
							++pCount;
						case PClose:
							--pCount;
							if (pCount == 0) return token();
						case _:
					}
				}
			case Unop(OpNot):
				return skipMacroCond();
			case _:
				// unexpected(tk);
		}

		return tk;
	}

	function unexpected(tk:Token)
	{
		throw 'unexpected $tk';
	}

	var states = new GenericStack<State>();
	var patterns = new GenericStack<Pattern>();

	public function test()
	{
		states.add(SExpr);
		patterns.add(getPattern(SExpr));

		while (true)
		{
			var tok = token();
			if (tok.tok == Eof || next(tok) == PNoMatch) break;

			var debug = states.array().map(Std.string);
			debug.reverse();
			debug.push(Std.string(tok.tok));
			trace(debug.join(' > '));
		}
	}

	function getPattern(state:State):Pattern
	{
		return switch (state)
		{
			case STopLevel:PList(POr([
				PState(SMeta),
				PState(SModifier),
				PState(SPackage),
				PState(SImport),
				PState(SUsing),
				PState(SClass),
				PState(STypeDef),
				PState(SAbstract),
				PState(SEnum)
			]));
			case SMeta:PSeq([
				PTok(At),
				POpt(PTok(DblDot))
			]);
			case SModifier:PList(POr([
				PTok(Kwd(KwdStatic)),
				PTok(Kwd(KwdPublic)),
				PTok(Kwd(KwdPrivate)),
				PTok(Kwd(KwdExtern)),
				PTok(Kwd(KwdInline)),
				PTok(Kwd(KwdMacro)),
				PTok(Kwd(KwdDynamic)),
				PTok(Kwd(KwdOverride))
			]));
			case SPackage:PSeq([
				PTok(Kwd(KwdPackage)), 
				POpt(PState(STypePath)), 
				PTok(Semicolon)
			]);
			case SImport:PSeq([
				PTok(Kwd(KwdImport)),
				PState(STypePath),
				POpt(PTok(Kwd(KwdIn))),
				POpt(PTok(Const(CIdent(null)))),
				POpt(PTok(Semicolon))
			]);
			case SClass:PSeq([
				PTok(Kwd(KwdClass)),
				PTok(Const(CIdent(null))),
				POpt(PState(STypeParams)),
				PList(POr([
					PState(SExtends),
					PState(SImplements)
				])),
				PTok(BrOpen),
				PList(POr([
					PState(SProperty),
					PState(SMethod)
				])),
				PTok(BrClose)
			]);
			case SExtends:PSeq([
				PTok(Kwd(KwdExtends)),
				PState(STypePath),
				PTok(Semicolon)
			]);
			case SImplements:PSeq([
				PTok(Kwd(KwdExtends)),
				PState(STypePath),
				PTok(Semicolon)
			]);
			case SProperty:PSeq([
			]);
			case SMethod:PSeq([
			]);
			case SUsing:PSeq([
			]);
			case STypePath:PSeq([
			]);
			case STypeParams:PSeq([
			]);
			case STypeDef:PSeq([
			]);
			case SEnum:PSeq([
			]);
			case SAbstract:PSeq([
			]);
			case SExpr:PSeq([
				POr([
					PState(SMeta),
					PTok(Const(CIdent(null))),
					PTok(Const(CString(null))),
					PTok(Const(CFloat(null))),
					PTok(Const(CInt(null))),
					PTok(Const(CRegexp(null, null))),
					PTok(Kwd(KwdTrue)),
					PTok(Kwd(KwdFalse)),
					PTok(Kwd(KwdNull)),
					PTok(Kwd(KwdThis)),
					PTok(Kwd(KwdBreak)),
					PTok(Kwd(KwdContinue)),
					PState(SUntyped),
					PState(SMacroExpr),
					PState(SDollar),
					PState(SFunction),
					PState(SCast),
					PState(SVarDecl),
					PState(SNegative),
					PState(SBlockOrStructure),
					PState(SArray),
					PState(SGroup),
					PState(SIf),
					PState(SElse),
					PState(SFor),
					PState(SWhile),
					PState(SDo),
					PState(SNew),
					PState(SUnop),
					PState(SInterval),
					PState(STry),
					PState(SSwitch)
				]),
				PState(SExprNext)
			]);
			case SExprNext:POr([
				PState(SCall),
				PSeq([
					PTok(Dot),
					POr([
						PTok(Const(CIdent(null))),
						PTok(Kwd(KwdMacro)),
						PTok(Kwd(KwdNew)),
						PTok(Dollar(null))
					]),
					PState(SExprNext)
				]),
				PSeq([
					PTok(Binop(OpGt)),
					POpt(PTok(Binop(OpGt))),
					POpt(PTok(Binop(OpGt))),
					POpt(PTok(Binop(OpGt))),
					POpt(PTok(Binop(OpAssign))),
					PState(SExpr),
					PState(SExprNext)
				]),
				PSeq([
					PTok(Binop(null)),
					PState(SExpr),
					PState(SExprNext)
				]),
				PSeq([
					PTok(Kwd(KwdIn)),
					PState(SExpr),
					PState(SExprNext)
				]),
				PSeq([
					PTok(BkOpen),
					PState(SExpr),
					PTok(BkClose),
					PState(SExprNext)
				]),
				PSeq([
					PTok(Question),
					PState(SExpr),
					PTok(DblDot),
					PState(SExpr),
					PState(SExprNext)
				]),
				PSeq([
					PTok(Unop(null)),
					PState(SExprNext),
				])
			]);
			case SUntyped:PSeq([
				PTok(Kwd(KwdUntyped)),
				PState(SExpr)
			]);
			case SMacroExpr:PSeq([
				PTok(Kwd(KwdMacro)),
				POr([
					PSeq([
						PTok(DblDot),
						PState(SComplexType)
					]),
					PSeq([
						PTok(Kwd(KwdVar)),
						PSep(PState(SVarDecl), PTok(Comma))
					]),
					PState(SExpr)
				])
			]);
			case SDollar:PSeq([
				PTok(Dollar(null)),
				POpt(PSeq([
					PTok(BrOpen),
					PState(SExpr),
					PTok(BrClose)
				]))
			]);
			case SFunction:PSeq([
				PTok(Kwd(KwdFunction))
			]);
			case SReturn:PSeq([
				PTok(Kwd(KwdReturn)),
				POpt(PState(SExpr))
			]);
			case SThrow:PSeq([
				PTok(Kwd(KwdFunction)),
				PState(SExpr)
			]);
			case SCast:PSeq([
				PTok(Kwd(KwdCast)),
				POr([
					PSeq([
						PTok(POpen),
						PState(SExpr),
						POpt(PSeq([
							PTok(Comma),
							PState(SComplexType)
						])),
						PTok(PClose)
					]),
					PState(SExpr)
				])
			]);
			case SVarDecl:PSeq([
				PTok(Kwd(KwdVar))
			]);
			case SNegative:PSeq([
				PTok(Binop(OpSub)),
				PState(SExpr)
			]);
			case SBlockOrStructure:POr([
				PState(SBlock),
				PState(SStructure)
			]);
			case SBlock:PSeq([
				PTok(BrOpen),
				PSep(PState(SBlockElement), PTok(Semicolon)),
				PTok(BrClose)
			]);
			case SStructure:PSeq([
				PTok(BrOpen),
				PSep(PState(SStructureElement), PTok(Comma)),
				PTok(BrClose)
			]);
			case SBlockElement:POr([
				PSeq([
					PTok(Kwd(KwdVar)),
					PSep(PState(SVarDecl), PTok(Comma)),
					PTok(Semicolon)
				]),
				PSeq([
					PState(SExpr),
					PTok(Semicolon)
				])
			]);
			case SStructureElement:PSeq([
			]);
			case SArray:PSeq([
				PTok(BkOpen),
				PSep(PState(SExpr), PTok(Comma)),
				PTok(BkClose)
			]);
			case SComplexType:PSeq([
			]);
			case SGroup:PSeq([
				PTok(POpen),
				PState(SExpr),
				POpt(PSeq([
					PTok(DblDot),
					PState(SComplexType)
				])),
				PTok(PClose)
			]);
			case SIf:PSeq([
				PTok(Kwd(KwdIf)),
				PTok(POpen),
				PState(SExpr),
				PTok(PClose),
				PState(SExpr),
				POpt(PTok(Semicolon)),
				POpt(PState(SElse))
			]);
			case SElse:PSeq([
				PTok(Kwd(KwdElse)),
				PState(SExpr)
			]);
			case SNew:PSeq([
				PTok(Kwd(KwdNew)),
				PState(STypePath),
				PTok(POpen),
				PSep(PState(SExpr), PTok(Comma)),
				PTok(PClose)
			]);
			case SFor:PSeq([
				PTok(Kwd(KwdFor)),
				PState(SExpr),
				PTok(POpen),
				PState(SExpr),
				PTok(PClose),
				PState(SExpr)
			]);
			case SWhile:PSeq([
				PTok(Kwd(KwdWhile)),
				PState(SExpr),
				PTok(POpen),
				PState(SExpr),
				PTok(PClose),
				PState(SExpr)
			]);
			case SDo:PSeq([
				PTok(Kwd(KwdDo)),
				PState(SExpr),
				PTok(Kwd(KwdWhile)),
				PTok(POpen),
				PState(SExpr),
				PTok(PClose)
			]);
			case SUnop:PSeq([
				PTok(Unop(null)),
				PState(SExpr)
			]);
			case SInterval:PSeq([
				PTok(IntInterval(null)),
				PState(SExpr)
			]);
			case STry:PSeq([
				PTok(Kwd(KwdTry)),
				PState(SExpr),
				PList(PState(SCatch))
			]);
			case SSwitch:PSeq([
				PTok(Kwd(KwdSwitch)),
				POr([
					PSeq([
						PTok(POpen),
						PState(SExpr),
						PTok(PClose)
					]),
					PState(SExpr)
				]),
				PTok(BrOpen),
				PList(POr([
					PState(SCase),
					PState(SDefault)
				])),
				PTok(BrClose)
			]);
			case SCase:PSeq([
				PTok(Kwd(KwdCase)),
				PSep(PState(SExpr), PTok(Comma)),
				POr([
					PTok(DblDot),
					PSeq([
						PTok(Kwd(KwdIf)),
						PTok(POpen),
						PState(SExpr),
						PTok(PClose),
						PTok(DblDot)
					])
				]),
				PList(PState(SBlockElement))

			]);
			case SDefault:PSeq([
				PTok(Kwd(KwdDefault)),
				PTok(DblDot),
				PList(PState(SBlockElement))
			]);
			case SCatch:PSeq([
				PTok(Kwd(KwdCatch)),
				PTok(POpen),
				POr([
					PTok(Const(CIdent(null))),
					PTok(Kwd(KwdMacro)),
					PTok(Kwd(KwdNew)),
					PTok(Dollar(null))
				]),
				PTok(DblDot),
				PState(SComplexType),
				PTok(PClose),
				PState(SExpr)
			]);
			case SCall:PSeq([
				PTok(POpen),
				PSep(PState(SExpr), PTok(Comma)),
				PTok(PClose),
				PState(SExprNext)
			]);
		}
	}

	function next(token:PrintToken)
	{
		return match(token, patterns.first());
	}

	function matchEnum(e:EnumValue, pattern:EnumValue)
	{
		if (Type.getEnum(e) != Type.getEnum(pattern)) return PNoMatch;
		if (Type.enumIndex(e) != Type.enumIndex(pattern)) return PNoMatch;
		var eParams = Type.enumParameters(e);
		var pParams = Type.enumParameters(pattern);
		if (eParams.length != pParams.length) return PNoMatch;
		for (i in 0...eParams.length)
			if (Type.getEnum(pParams[i]) != null && matchEnum(eParams[i], pParams[i]) == PNoMatch)
				return PNoMatch;
		return PMatch;
	}

	function match(token:PrintToken, pattern:Pattern)
	{
		trace('match ${token.tok} with $pattern');
		patterns.add(pattern);

		switch (pattern)
		{
			case POpt(pat):
				switch (match(token, pat))
				{
					case PMatch:
						patterns.pop();
						return PMatch;
					case _:
				}
			case PTok(tok):
				switch (matchEnum(token.tok, tok))
				{
					case PMatch:
						patterns.pop();
						return PMatch;
					case _:
				}
			case PSeq(pats):
				while (pats.length > 0)
				{
					var pat = pats[0];
					switch (match(token, pat))
					{
						case PMatch:
							pats.shift();
							if (pats.length == 0) patterns.pop();
							return PMatch;
						case PNoMatch: switch (pat)
						{
							case POpt(_):
								pats.shift();
								if (pats.length == 0) patterns.pop();
								// return pat;
							case _: break;
						}
						case _:
					}
				}
			case POr(pats):
				for (pat in pats)
				{
					switch (match(token, pat))
					{
						case PMatch:
							patterns.pop();
							return PMatch;
						case _:
					}
				}
			case PState(state):
				states.add(state);
				trace('enter $state');
				if (match(token, getPattern(state)) == PMatch) return PMatch;
				trace('exit $state');
				states.pop();
			case _:
		}
		patterns.pop();
		return PNoMatch;
	}
}
