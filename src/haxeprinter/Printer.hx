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
	SModifier;
	SMeta(i:Int);
	SPackage;
	STypePath;
	SImport;
	SUsing;
	SClassDecl;
	SClassProp;
	SClassPropAccess(i:Int);
	SClassFunction;
	SClassFunctionArgs;
	STypeDef;
	SAbstract;
	SComplexType;
	SComplexTypeNext;
	SComplexTypeParent;
	STypePathParams;
	SClassBody;
	STypeField(i:Int);
	SExpr;
	SExprNext;
	SMacroExpr;
	SDollarExpr;
	SFunction;
	SCast;
	SVarDecl;
	SBlockOrStructure;
	SArrayDecl;
	SParen;
	SIf;
	SNew;
	SFor;
	SWhile;
	SDo;
	SCall;
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
		// var s = "package #if false #if (foo || bar) test.baz. #else bar. #end bing #if boo .foo; #else .s; #end #else ; #end";
		var s =
"class A
{
	// var a:Int;
	var a:Int -> (Int -> Float) -> Void;
	// var a:b.C;
}";
		var input = byte.ByteData.ofString(s);
		var lexer = new HaxeLexer(input, "test");
		new Printer(input, lexer);
	}

	var buf = new StringBuf();
	var stream = new Array<PrintToken>();
	var states = new GenericStack<State>();
	var saved = new GenericStack<GenericStack<State>>();
	var lexer:HaxeLexer;

	public function new(input:byte.ByteData, lexer:HaxeLexer)
	{
		this.lexer = lexer;
		enter(STopLevel);
		
		while (true)
		{
			var tk = token();
			process(tk);
			if (tk.tok == Eof) break;
		}

		for (tk in stream)
		{
			buf.add(tk.before);
			buf.add(toString(tk, input));
		}

		log(buf.toString());
	}

	function log(msg:Dynamic)
	{
		Sys.println(msg);
	}

	function save()
	{
		log('save $states');
		var copy = new GenericStack<State>();
		var array = states.array();
		array.reverse();
		for (state in array) copy.add(state);
		saved.add(copy);
	}

	function restore()
	{
		if (saved.isEmpty()) throw 'no states to restore';
		states = saved.first();
		log('restore $states');
	}

	function end()
	{
		saved.pop();
		log('end');
	}

	function enter(s:State)
	{
		states.add(s);
		
		var copy = states.array();
		copy.reverse();
		log(copy.join(' '));
	}

	function exit()
	{
		states.pop();

		var copy = states.array();
		copy.reverse();
		log(copy.join(' ')+' <');
	}

	function exitAndProcess(tk:PrintToken)
	{
		exit();
		process(tk);
	}

	function enterAndProcess(s:State, tk:PrintToken)
	{
		enter(s);
		process(tk);
	}

	function exitEnterAndProcess(s:State, tk:PrintToken)
	{
		exit();
		enterAndProcess(s, tk);
	}

	function exitAndEnter(s:State)
	{
		exit();
		enter(s);
	}

	function unexpected(tk:PrintToken)
	{
		throw 'unexpected ${tk.tok} in state ${states.first()}';
	}

	function rawToken()
	{
		var tk = lexer.token(HaxeLexer.tok);
		var style = switch (tk.tok)
		{
			case Const(CIdent(_)): SIdent;
			case Const(CString(s)): SString;
			case Const(_): SConst;
			case Kwd(_): SKwd;
			case _: SNone;
		}
		var ptk = { before:tk.space, after:'', tok:tk.tok,  pos:tk.pos, style:style }
		add(ptk);
		return ptk;
	}

	function token()
	{
		var tk = rawToken();
		return switch (tk.tok)
		{
			case CommentLine(_) | Comment(_):
				token();
			case Sharp('if'):
				save();
				skipMacroCond();
			case Sharp('elseif'):
				restore();
				skipMacroCond();
			case Sharp('else'):
				restore();
				token();
			case Sharp('end'):
				end();
				token();
			case _: tk;
		}
	}

	function add(tk:PrintToken)
	{
		log(tk.tok);
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
				unexpected(tk);
		}

		return tk;
	}

	function process(tk:PrintToken)
	{
		var tok = tk.tok;

		switch (states.first())
		{
			case STopLevel: switch (tok)
			{
				case At: enter(SMeta(0));
				case Kwd(KwdStatic | KwdPublic | KwdPrivate | KwdExtern | KwdInline | 
					KwdMacro | KwdDynamic | KwdOverride): enter(SModifier);
				case Kwd(KwdPackage): enter(SPackage);
				case Kwd(KwdImport): enter(SImport);
				case Kwd(KwdUsing): enter(SUsing);
				case Kwd(KwdClass | KwdInterface): enter(SClassDecl);
				case Kwd(KwdTypedef): enter(STypeDef);
				case Kwd(KwdAbstract): enter(SAbstract);
				case Eof: return;
				case _: unexpected(tk);
			}
			case SPackage: switch (tok)
			{
				case Const(CIdent(_)) | Kwd(KwdMacro | KwdNew): enter(STypePath);
				case Semicolon: exit();
				case _: unexpected(tk);
			}
			case SClassDecl: switch (tok)
			{
				case Const(CIdent(_)):
				case Binop(OpLt): enter(STypePathParams);
				case Kwd(KwdExtends | KwdImplements): enter(SComplexType);
				case BrOpen: exitAndEnter(SClassBody);
				case _: unexpected(tk);
			}
			case SClassBody: switch (tok)
			{
				case At: enter(SMeta(0));
				case Kwd(KwdStatic | KwdPublic | KwdPrivate | KwdExtern | KwdInline | 
					KwdMacro | KwdDynamic | KwdOverride): enter(SModifier);
				case Kwd(KwdVar): enter(SClassProp);
				case Kwd(KwdFunction): enter(SClassFunction);
				case BrClose: exit();
				case _: exitAndProcess(tk);
			}
			case SClassProp: switch (tok)
			{
				case Const(CIdent(_)):
				case POpen: enter(SClassPropAccess(0));
				case DblDot: enter(SComplexType);
				case Binop(OpAssign): enter(SExpr);
				case Semicolon: exit();
				case _: unexpected(tk);
			}
			case SClassPropAccess(i): switch (tok)
			{
				case Const(CIdent(_)) | Kwd(KwdNull | KwdDynamic | 
					KwdDefault) if (i == 0 || i == 2): exitAndEnter(SClassPropAccess(i+1));
				case Comma if (i == 1): exitAndEnter(SClassPropAccess(i+1));
				case PClose if (i == 3): exit();
				case _: unexpected(tk);
			}
			case SClassFunction: switch (tok)
			{
				case Const(CIdent(_)) | Kwd(KwdNew):
				case POpen: enter(SClassFunctionArgs);
				case BrOpen: enter(SExpr);
				case _: unexpected(tk);
			}
			case SClassFunctionArgs: switch (tok)
			{
				case PClose: exit();
				case _: unexpected(tk);
			}
			case STypeDef: switch (tok)
			{
				case Binop(OpGt): enter(SComplexType);
				case Comma:
				case Question | Const(CIdent(_)): enterAndProcess(STypeField(0), tk);
				case BrClose: exit();
				case _: exitAndProcess(tk);
			}
			case SExpr: switch (tok)
			{
				case At: enter(SMeta(0));
				case Const(CInt(_) | CFloat(_) | CRegexp(_,_)) | Kwd(KwdTrue | KwdFalse | KwdNull):
				case Const(CIdent(_)):
				case Const(CString(s)):
				case Kwd(KwdThis):
					tk.style = SDecl;
				case Kwd(KwdUntyped):
					enter(SExpr);
				case Kwd(KwdMacro):
					enter(SMacroExpr);
				case Dollar(_):
					tk.style = SKwd;
					enter(SDollarExpr);
				case Kwd(KwdBreak | KwdContinue):
				case Kwd(KwdFunction):
					enter(SFunction);
				case Kwd(KwdReturn):
				case Kwd(KwdThrow):
					enter(SExpr);
				case Kwd(KwdCast):
					enter(SCast);
				case Kwd(KwdVar):
					enter(SVarDecl);
				case Binop(OpSub):
					enter(SExpr);
				case BrOpen:
					enter(SBlockOrStructure);
				case BkOpen:
					enter(SArrayDecl);
				case POpen:
					enter(SParen);
				case Kwd(KwdIf):
					enter(SIf);
				case Kwd(KwdNew):
					enter(SNew);
				case Kwd(KwdFor):
					enter(SFor);
				case Kwd(KwdWhile):
					enter(SWhile);
				case Kwd(KwdDo):
					enter(SDo);
				case _:
					exitAndProcess(tk);
			}
			enter(SExprNext);
			case SExprNext: switch (tok)
			{
				case POpen:
					enter(SCall);
				case _:
					exitAndProcess(tk);
			}
			case SIf: switch (tok)
			{
				case POpen: enter(SExpr);
				case PClose: enter(SExpr);
				case _: exitAndProcess(tk);
			}
			case SMeta(i): switch (tok)
			{
				case DblDot if (i == 0): exitAndEnter(SMeta(1));
				case Const(CIdent(_)) | Kwd(_) if (i == 0 || i == 1): exitAndEnter(SMeta(2));
				case POpen if (i == 2):
				case _: exitAndProcess(tk);
			}
			case STypeField(i): switch (tok)
			{
				case Question if (i == 0): exitAndEnter(STypeField(1));
				case Const(CIdent(_)) if (i == 0 || i == 1): exitAndEnter(STypeField(2));
				case DblDot if (i == 2): enter(SComplexType);
				case _: exitAndProcess(tk);
			}
			case SComplexType: switch (tok)
			{
				case Const(CIdent(_)):
					exitAndEnter(SComplexTypeNext);
					enter(STypePath);
				case BrOpen:
					exitAndEnter(SComplexTypeNext);
					enter(STypeDef);
				case POpen:
					exitAndEnter(SComplexTypeParent);
					enter(SComplexType);
				case _: exitEnterAndProcess(SComplexTypeNext, tk);
			}
			case SComplexTypeNext: switch (tok)
			{
				case Arrow: enter(SComplexType);
				case _: exitAndProcess(tk);
			}
			case SComplexTypeParent: switch (tok)
			{
				case PClose: exit();
				case _: exitAndProcess(tk);
			}
			case STypePath: switch (tok)
			{
				case Const(CIdent(_)) | Dot:
				case Binop(OpLt): enter(STypePathParams);
				case _: exitAndProcess(tk);
			}
			case STypePathParams: switch (tok)
			{
				case Const(CIdent(_)) | BrOpen: enterAndProcess(SComplexType, tk);
				case Comma:
				case Binop(OpGt): exit();
				case _: unexpected(tk);
			}
			case SModifier: switch (tok)
			{
				case Kwd(KwdStatic | KwdPublic | KwdPrivate | KwdExtern | KwdInline | 
					KwdMacro | KwdDynamic | KwdOverride):
				case _: exitAndProcess(tk);
			}
			case state: throw 'not yet implmented: $state';
		}
	}
}
