package haxeprinter;

typedef Config = {
	// new lines
	
	@:default(true)
	var empty_line_at_end_of_file:Bool;

	@:default(false)
	var empty_line_before_imports:Bool;
	
	@:default(true)
	var empty_line_before_type:Bool;
	
	@:default(true)
	var empty_line_between_fields:Bool;
	
	@:default(false)
	var empty_line_between_enum_constructors:Bool;
	
	@:default(false)
	var extends_on_newline:Bool;
	
	@:default(false)
	var implements_on_newline:Bool;
	
	@:default(["override", "public", "private", "static", "extern", "dynamic", "inline", "macro"])
	var modifier_order:Array<String>;
	
	// cuddly braces
	
	@:default(false)
	var cuddle_type_braces:Bool;
	
	@:default(false)
	var cuddle_method_braces:Bool;
	
	// spaces
	
	@:default(true)
	var space_between_type_params:Bool;
	
	@:default(true)
	var space_between_type_param_constraints:Bool;
	
	@:default(true)
	var space_between_property_get_set:Bool;
	
	@:default(true)
	var space_between_function_args:Bool;
	
	@:default(false)
	var space_before_type_hint_colon:Bool;
	
	@:default(false)
	var space_after_type_hint_colon:Bool;
	
	@:default(true)
	var space_around_property_assign:Bool;
	
	@:default(false)
	var space_around_function_arg_assign:Bool;
	
	@:default(false)
	var space_before_structure_colon:Bool;
	
	@:default(false)
	var space_after_structure_colon:Bool;

	@:default(true)
	var space_around_typedef_assign:Bool;
	
	@:default(true)
	var space_between_anon_type_fields:Bool;
	
	@:default(100)
	var maximum_line_length:Int;

	// not implemented from here
	
	@:default(false)
	var print_root_package:Bool;
	
	@:default(false)
	var inline_empty_braces:Bool;
	
	@:default(false)
	var function_arg_on_newline:Bool;
	
	@:default(false)
	var remove_private_field_modifier:Bool;
	
	@:default(false)
	var empty_line_between_typedef_fields:Bool; // TODO: bad name
	
	@:default(false)
	var space_between_enum_constructor_args:Bool;
}