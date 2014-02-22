/*
	Test file
*/
	

   	package    	  foo.bar  	 ;


   	import haxe.ds.*;


   	import haxe.Http in HaxeHttp;


  import haxe.Json;

 	  class  	 TestSource  <T:(String,Int)> extends bar.Foo<Array<String>> implements Bar<Int, Float> implements String

 	  	{


   public var foo:Bar;

   	private var    baz =  1
   		;
   var boo:Bar<T> =12.1;

   var prop(
   	get, set):Int = 1;

 	  public function new()
 	  {
 	  	if (true) trace('hello world');
 	  }

 	  private static #if (level > 9000) macro #end inline function foo<T:(Int,Bool)>(a:String, b:Array<Int>, c, ?d:Foo, ?e:Int=10):List<{x:Int, y:Int}>      {

 	doStuff();

 				"so whitespace";

 									"many alignment";
 						"wow";


 			"such layout";
 	  		}


 	 }

  extern    /*private*/ class Another {}


  	interface   Foo {   }


 private extern 	enum Food<T>
			{
	Lunch<T>;

	Dinner(starter:String, dessert  :  T);
}

enum Blah {}

typedef Ref = haxe.macro.Expr;

typedef MyDef<A,B> =   {
	name   : String,
	flags :   Array<A>,
	data: B
}

