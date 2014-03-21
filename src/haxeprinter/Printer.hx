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
	SIdent;
	SExpr;
	SAssign;
	SConst;
}

enum Pattern
{
	PTok(tok:TokenDef);
	PState(state:State);
	POr(pats:Array<Pattern>);
	PList(pat:Pattern);
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
		var printer = new Printer(byte.ByteData.ofString('a = 1'), cast {}, 'test');
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
		match(token(), PState(SExpr));
		trace('--------');
		match(token());
		trace('--------');
		match(token());
		// match(token());
		// match(token());
	}

	function nextPattern()
	{
		return switch (patterns.first())
		{
			case PNoMatch | PMatch | PSeq([]):
				patterns.pop();
				states.pop();
				nextPattern();
			case _:
				patterns.first();
		}
	}

	function getPattern(state:State, token:PrintToken):Pattern
	{
		return switch (state)
		{
			case STopLevel:POr([
				PState(SMeta),
				PState(SModifier),
				PState(SPackage),
				PState(SImport),
				PState(SUsing),
				PState(SClass),
				PState(STypeDef),
				PState(SAbstract),
				PState(SEnum)
			]);
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
				POpt(PState(SIdent)),
				POpt(PTok(Semicolon))
			]);
			case SClass:PSeq([
				PTok(Kwd(KwdClass)),
				PState(SIdent),
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
			case SExpr:POr([
				PState(SAssign),
				PState(SConst)
			]);
			case SAssign:PSeq([
				PState(SIdent),
				PTok(Binop(OpAssign)),
				PState(SExpr)
			]);
			case SIdent: switch (token.tok)
			{
				case Const(CIdent(_)): PMatch;
				case _: PNoMatch;
			}
			case SConst: switch (token.tok)
			{
				case Const(CString(_) | CFloat(_) | CInt(_) | CRegexp(_,_)): PMatch;
				case _: PNoMatch;
			}
		}
	}

	function match(token:PrintToken, ?pattern:Pattern)
	{
		if (pattern == null) pattern = nextPattern();
		trace('match ${token.tok} with $pattern');

		switch (pattern)
		{
			case POpt(pat):
				return match(token, pat);
			case PTok(tok):
				return match(token, Type.enumEq(token.tok, tok) ? PMatch : PNoMatch);
			case PSeq(pats):
				while (pats.length > 0)
				{
					var pat = pats[0];
					switch (match(token, pat))
					{
						case pat = PMatch:
							pats.shift();
							return pat;
						case PNoMatch: switch (pat)
						{
							case POpt(_):
								pats.shift();
								return pat;
							case _: break;
						}
						case _:
					}
				}
				trace(">>>");
				patterns.pop();
				states.pop();
				return PNoMatch;
			case POr(pats):
				for (pat in pats)
				{
					var match = match(token, pat);
					switch (match)
					{
						case PMatch: return pat;
						case _:
					}
				}
				return PNoMatch;
			case PList(pat):
				return PNoMatch;
			case PState(state):
				states.add(state);
				var pat = getPattern(state, token);
				patterns.add(pat);
				return match(token, pat);
			case PNoMatch:
				return match(token);
			case PMatch:
				trace(states.array().join(' > '));
				return PMatch;
			case pat:
				return pat;
		}
	}
}
