import haxeprinter.Config;

class TestExpr extends TestCommon {
	
	static var defaultConfig:Config = {
		var config = haxe.Json.parse(haxe.Resource.getString('config-default'));
		config.empty_line_at_end_of_file = false;
		config.inline_empty_braces = true;
		config;
	}
	
	function test_space_between_function_args() {
		var config2 = Reflect.copy(defaultConfig);
		config2.space_between_function_args = false;
		
		exprEq("a(   b,   c)", defaultConfig, "a(b, c)");
		exprEq("a(   b,   c)", config2, "a(b,c)");
		
		exprEq("new A(   b,   c)", defaultConfig, "new A(b, c)");
		exprEq("new B(   b,   c)", config2, "new B(b,c)");
	}
	
	function test_space_before_type_hint_colon() {
		var config2 = Reflect.copy(defaultConfig);
		config2.space_before_type_hint_colon = true;
		
		exprEq("var x :   Int", defaultConfig, "var x:Int");
		exprEq("var x :   Int", config2, "var x :Int");
		
		exprEq("function ():Int", defaultConfig, "function ():Int");
		exprEq("var x :   Int", config2, "var x :Int");
		
		exprEq(" (x : Int)", defaultConfig, "(x:Int)");
		exprEq(" (x : Int)", config2, "(x :Int)");
	}
	
	function test_space_after_type_hint_colon() {
		var config2 = Reflect.copy(defaultConfig);
		config2.space_after_type_hint_colon = true;
		
		exprEq("var x :   Int", config2, "var x: Int");
		exprEq("var x :   Int", config2, "var x: Int");
		exprEq(" (x : Int)", config2, "(x: Int)");
	}
}