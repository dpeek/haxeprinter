/*
	Test file
*/
package;

import haxe.ds.*;
import haxe.Http in HaxeHttp;
import haxe.Json;

class TestSource <T:(String,Int)> 
extends bar.Foo<Array<String>> implements Bar<Int, Float> implements String
{
	public var foo:Bar;
	private var baz = 1;
	var boo:Bar<T> =12.1;

	var prop(get, set):Int = 1;

	public function new()
	{
		#if foo
		trace("foo");
		#else
		trace("bar");
		#end
		if (true) trace('hello world');
	}

	private static #if flash inline #end function foo<T:(Int,Bool)>(a:String, b:Array<Int>, c, ?d:Foo, ?e:Int=10):List<{x:Int, y:Int}>
	{
		doStuff();
		"so whitespace";
	}
}

extern /*private*/ class Another {}

interface Foo {}

private extern enum Food<T>
{
	Lunch<T>;
	Dinner(starter:String, dessert  :  T);
}

enum Blah {}

typedef Ref = haxe.macro.Expr;

typedef MyDef<A,B> = {
	name:String,
	flags:Array<A>,
	data:B
}
