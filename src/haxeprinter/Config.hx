package haxeprinter;

typedef ConfigSpaceAfter = {
	@:default(false)
	var type_hint_colon:Bool;
}

typedef ConfigSpaceAround = {
	@:default(true)
	var assignment_operators:Bool;

	@:default(true)
	var logical_operators:Bool;

	@:default(true)
	var equality_operators:Bool;

	@:default(true)
	var relational_operators:Bool;

	@:default(true)
	var additive_operators:Bool;

	@:default(true)
	var multiplicative_operators:Bool;

	@:default(false)
	var unary_operators:Bool;
	
	@:default(true)
	var arrow:Bool;
}

typedef ConfigSpaceBefore = {
	@:default(false)
	var method_declaration_parenthesis:Bool;
	
	@:default(false)
	var method_call_parenthesis:Bool;

	@:default(true)
	var if_parenthesis:Bool;

	@:default(true)
	var for_parenthesis:Bool;

	@:default(true)
	var while_parenthesis:Bool;

	@:default(true)
	var switch_parenthesis:Bool;

	@:default(true)
	var catch_parenthesis:Bool;

	@:default(true)
	var method_left_brace:Bool;

	@:default(true)
	var if_left_brace:Bool;

	@:default(true)
	var else_left_brace:Bool;

	@:default(true)
	var for_left_brace:Bool;

	@:default(true)
	var while_left_brace:Bool;

	@:default(true)
	var switch_left_brace:Bool;

	@:default(true)
	var try_left_brace:Bool;

	@:default(true)
	var catch_left_brace:Bool;

	@:default(true)
	var else_keyword:Bool;

	@:default(true)
	var while_keyword:Bool;

	@:default(true)
	var catch_keyword:Bool;

	@:default(false)
	var type_hint_colon:Bool;
}

typedef ConfigSpaceBetween = {
	@:default(true)
	var type_parameters:Bool;

	@:default(true)
	var function_arguments:Bool;

	@:default(true)
	var call_arguments:Bool;

	@:default(true)
	var enum_arguments:Bool;

	@:default(true)
	var type_constraints:Bool;

	@:default(true)
	var var_declarations:Bool;
}

typedef ConfigSpaceWithin = {
	@:default(false)
	var method_call_parenthesis:Bool;

	@:default(false)
	var method_declaration_parenthesis:Bool;

	@:default(false)
	var if_parenthesis:Bool;

	@:default(false)
	var for_parenthesis:Bool;

	@:default(false)
	var while_parenthesis:Bool;

	@:default(false)
	var switch_parenthesis:Bool;

	@:default(false)
	var catch_parenthesis:Bool;

	@:default(false)
	var ternary_before_question:Bool;

	@:default(false)
	var ternary_after_question:Bool;

	@:default(false)
	var ternary_before_colon:Bool;

	@:default(false)
	var ternary_after_colon:Bool;
}

typedef ConfigSpace = {
	var after:ConfigSpaceAfter;
	
	var around:ConfigSpaceAround;
	
	var before:ConfigSpaceBefore;
	
	var between:ConfigSpaceBetween;
	
	var within:ConfigSpaceWithin;
	
	@:default(true)
	var condense_multiple:Bool;
}

typedef ConfigNewline = {
	@:default(true)
	var condense_multiple:Bool;
	
	@:default(true)
	var empty_at_end_of_file:Bool;

	@:default(false)
	var before_brace:Bool;

	@:default(false)
	var before_extends:Bool;

	@:default(false)
	var before_implements:Bool;
}

typedef Config =
{
	var newline:ConfigNewline;
	var space:ConfigSpace;
}
