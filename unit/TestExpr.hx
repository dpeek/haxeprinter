import haxeprinter.Config;

import TestFileMacro.test;

class TestExpr extends TestCommon {
	
	static var defaultConfig:Config = {
		var config:Config = haxe.Json.parse(haxe.Resource.getString('config-default'));
		config.newline.empty_at_end_of_file = false;
		config;
	}
	
	static function copyConfig() {
		return haxe.Json.parse(haxe.Json.stringify(defaultConfig));
	}
	
	override function setup() {
		currentConfig = copyConfig();
	}
	
	function test_space_before_method_call_parenthesis() {
		test(
			["a()", "a(b)", "a(b, c)"],
			space.before.method_call_parenthesis = true,
			["a ()", "a (b)", "a (b, c)"]
		);
	}
	
	function test_space_before_if_parenthesis() {
		test(
			"if (a) {}",
			space.before.if_parenthesis = false,
			"if(a) {}"
		);
	}
	
	function test_space_before_for_parenthesis() {
		test(
			"for (a) {}",
			space.before.for_parenthesis = false,
			"for(a) {}"
		);
	}
	
	function test_space_before_while_parenthesis() {
		test(
			["while (a) {}", "do {} while (a)"],
			space.before.while_parenthesis = false,
			["while(a) {}", "do {} while(a)"]
		);
	}

	function test_space_before_switch_parenthesis() {
		test(
			"switch (a) {}",
			space.before.switch_parenthesis = false,
			"switch(a) {}"
		);
	}
	
	function test_space_before_catch_parenthesis() {
		test(
			"try {} catch (b:C) {}",
			space.before.catch_parenthesis = false,
			"try {} catch(b:C) {}"
		);
	}
	
	function test_space_around_assignment_operators() {
		test(
			["x = 1", "var x = 1", "function x(x = 1) {}"],
			space.around.assignment_operators = false,
			["x=1", "var x=1", "function x(x=1) {}"]
		);
	}
	
	function test_space_around_logical_operators() {
		test(
			["1 || 2", "1 && 2"],
			space.around.logical_operators = false,
			["1||2", "1&&2"]
		);
	}
	
	function test_space_around_equality_operators() {
		test(
			["1 == 2", "1 != 2"],
			space.around.equality_operators = false,
			["1==2", "1!=2"]
		);
	}
	
	function test_space_around_relational_operators() {
		test(
			["1 > 2", "1 >= 2", "1 < 2", "1 <= 2"],
			space.around.relational_operators = false,
			["1>2", "1>=2", "1<2", "1<=2"]
		);
	}
	
	function test_space_around_additive_operators() {
		test(
			["1 + 2", "1 - 2"],
			space.around.additive_operators = false,
			["1+2", "1-2"]
		);
	}
	
	function test_space_around_multiplicative_operators() {
		test(
			["1 * 2", "1 / 2", "1 % 2"],
			space.around.multiplicative_operators = false,
			["1*2", "1/2", "1%2"]
		);
	}
	
	function test_space_before_method_left_brace() {
		test(
			"function() {}",
			space.before.method_left_brace = false,
			"function(){}"
		);
	}
	
	function test_space_before_if_left_brace() {
		test(
			"if (a) {}",
			space.before.if_left_brace = false,
			"if (a){}"
		);
	}
	
	function test_space_before_else_left_brace() {
		test(
			"if (a) {} else {}",
			space.before.else_left_brace = false,
			"if (a) {} else{}"
		);
	}
	
	function test_space_before_for_left_brace() {
		test(
			"for (a) {}",
			space.before.for_left_brace = false,
			"for (a){}"
		);
	}
	
	function test_space_before_while_left_brace() {
		test(
			"while (a) {}",
			space.before.while_left_brace = false,
			"while (a){}"
		);
	}
	
	function test_space_before_switch_left_brace() {
		test(
			"switch (a) {}",
			space.before.switch_left_brace = false,
			"switch (a){}"
		);
	}
	
	function test_space_before_try_left_brace() {
		test(
			"try {} catch (a:B) {}",
			space.before.try_left_brace = false,
			"try{} catch (a:B) {}"
		);
	}
	
	function test_space_before_catch_left_brace() {
		test(
			"try {} catch (a:B) {}",
			space.before.catch_left_brace = false,
			"try {} catch (a:B){}"
		);
	}
	
	function test_space_before_else_keyword() {
		test(
			["if (a) {} else {}", "if (a)b else {}"],
			space.before.else_keyword = false,
			["if (a) {}else {}", "if (a)b else {}"]
		);
	}
	
	function test_space_before_while_keyword() {
		test(
			["do {} while (a)", "do a while (b)"],
			space.before.while_keyword = false,
			["do {}while (a)", "do a while (b)"]
		);
	}
	
	function test_space_before_catch_keyword() {
		test(
			["try {} catch (b:B) {}", "try a catch (b:B) {}"],
			space.before.catch_keyword = false,
			["try {}catch (b:B) {}", "try a catch (b:B) {}"]
		);
	}
	
	function test_space_within_method_call_parenthesis() {
		test(
			["a()", "a(b)", "a(b, c)"],
			space.within.method_call_parenthesis = true,
			["a( )", "a( b )", "a( b, c )"]
		);
	}
	
	function test_space_within_method_declaration_parenthesis() {
		test(
			["function() {}", "function(a) {}", "function(a, b)"],
			space.within.method_declaration_parenthesis = true,
			["function( ) {}", "function( a ) {}", "function( a, b )"]
		);
	}
	
	function test_space_within_if_parenthesis() {
		test(
			"if (a) {}",
			space.within.if_parenthesis = true,
			"if ( a ) {}"
		);
	}
	
	function test_space_within_for_parenthesis() {
		test(
			"for (a) {}",
			space.within.for_parenthesis = true,
			"for ( a ) {}"
		);
	}
	
	function test_space_within_while_parenthesis() {
		test(
			["while (a) {}", "do {} while (a)"],
			space.within.while_parenthesis = true
			//["while ( a ) {}", "do {} while ( a )"]
		);
	}
	
	function test_space_within_switch_parenthesis() {
		test(
			"switch (a) {}",
			space.within.switch_parenthesis = true,
			"switch ( a ) {}"
		);
	}
	
	function test_space_within_catch_parenthesis() {
		test(
			"try {} catch (a:B) {}",
			space.within.catch_parenthesis = true,
			"try {} catch ( a:B ) {}"
		);
	}
	
	function test_space_within_ternary() {
		test(
			"a?b:c",
			space.within.ternary_before_question = true,
			"a ?b:c",
			space.within.ternary_after_question = true,
			"a ? b:c",
			space.within.ternary_before_colon = true,
			"a ? b :c",
			space.within.ternary_after_colon = true,
			"a ? b : c"
		);
	}
	
	function test_space_around_arrow() {
		test(
			["(x:a -> b)", "(x:a -> b -> c)"],
			space.around.arrow = false,
			["(x:a->b)", "(x:a->b->c)"]
		);
	}
	
	function test_space_before_type_hint_colon() {
		test(
			["(a:B)", "var a:B", "function():A {}"],
			space.before.type_hint_colon = true,
			["(a :B)", "var a :B", "function() :A {}"]
		);
	}
	
	function test_space_after_type_hint_colon() {
		test(
			["(a:B)", "var a:B", "function():A {}"],
			space.after.type_hint_colon = true,
			["(a: B)", "var a: B", "function(): A {}"]
		);
	}
	
	function test_space_between_type_parameters() {
		test(
			["function a<A>() {}", "function a<A, B>() {}", "function a<A, B, C>() {}"],
			space.between.type_parameters = false,
			["function a<A>() {}", "function a<A,B>() {}", "function a<A,B,C>() {}"]
		);
	}
	
	function test_space_between_function_arguments() {
		test(
			["function a() {}", "function a(b) {}", "function a(b, c) {}"],
			space.between.function_arguments = false,
			["function a() {}", "function a(b) {}", "function a(b,c) {}"]
		);
	}
	
	function test_space_between_call_arguments() {
		test(
			["a()", "a(b)", "a(b, c)"],
			space.between.call_arguments = false,
			["a()", "a(b)", "a(b,c)"]
		);
	}
	
	function test_space_between_type_constraints() {
		test(
			["function a<B:C>() {}", "function a<B:(C, D)>() {}"],
			space.between.type_constraints = false,
			["function a<B:C>() {}", "function a<B:(C,D)>() {}"]
		);
	}
	
	function testPreprocessor() {
		test(
			["function #if true foo #elseif false bar #else baz #end() {}"]
		);
	}

	// TODO: space_between_var_declarations (requires blocks)
}