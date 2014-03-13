package haxeprinter;

typedef Config =
{
	@:default(true)
	var condense_multiple_spaces:Bool;

	@:default(true)
	var condense_multiple_empty_lines:Bool;

	@:default(true)
	var empty_line_at_end_of_file:Bool;

	// space

	// before parenthesis

	@:default(false)
	var space_before_method_declaration_parenthesis:Bool;

	@:default(false)
	var space_before_method_call_parenthesis:Bool;

	@:default(true)
	var space_before_if_parenthesis:Bool;

	@:default(true)
	var space_before_for_parenthesis:Bool;

	@:default(true)
	var space_before_while_parenthesis:Bool;

	@:default(true)
	var space_before_switch_parenthesis:Bool;

	@:default(true)
	var space_before_catch_parenthesis:Bool;

	// around operators

	@:default(true)
	var space_around_assignment_operators:Bool;

	@:default(true)
	var space_around_logical_operators:Bool;

	@:default(true)
	var space_around_equality_operators:Bool;

	@:default(true)
	var space_around_relational_operators:Bool;

	@:default(true)
	var space_around_additive_operators:Bool;

	@:default(true)
	var space_around_multiplicative_operators:Bool;

	@:default(true)
	var space_around_unary_operators:Bool;

	// before left brace

	@:default(true)
	var space_before_method_left_brace:Bool;

	@:default(true)
	var space_before_if_left_brace:Bool;

	@:default(true)
	var space_before_else_left_brace:Bool;

	@:default(true)
	var space_before_for_left_brace:Bool;

	@:default(true)
	var space_before_while_left_brace:Bool;

	@:default(true)
	var space_before_switch_left_brace:Bool;

	@:default(true)
	var space_before_try_left_brace:Bool;

	@:default(true)
	var space_before_catch_left_brace:Bool;

	// before keywords

	@:default(true)
	var space_before_else_keyword:Bool;

	@:default(true)
	var space_before_while_keyword:Bool;

	@:default(true)
	var space_before_catch_keyword:Bool;
}
