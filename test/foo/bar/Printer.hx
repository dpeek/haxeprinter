package haxeprinter;

import haxeparser.Data;
import haxe.macro.Expr;
using haxe.macro.Tools;

class Printer
{
	var config:Dynamic;
	var buf:StringBuf;
	var line:StringBuf;
	var indentLevel:Int;
	var indent:String;
	var col:Int;

	public function new()
	{
		this.config = haxe.Json.parse(sys.io.File.getContent('config.json'));
	}
	
	function setIndent(level:Int)
	{
		indentLevel = level;
		if (config.indent_with_tabs) indent = StringTools.lpad('', '\t', indentLevel);
		else indent = StringTools.lpad('', ' ', Std.int(indentLevel * config.tab_width));
	}

	function newline()
	{
		buf.add(line.toString() + '\n');
		line = new StringBuf();
		col = 0;
	}

	function print(s:String, ?style:Style)
	{
		if (style == null) style = SNormal;
		line.add(s);
	}

	function breakPoint(force:Bool=false)
	{
		if (col > 0 && (force || col + line.length > config.maximum_line_length))
		{
			buf.add('\n');
			setIndent(indentLevel + 1);
			buf.add(indent);
			col = indent.length;
			setIndent(indentLevel - 1);
		}
		
		col += line.length;
		buf.add(line.toString());
		line = new StringBuf();
	}


	public function printAST(ast:{pack:Array<String>, decls:Array<TypeDef>})
	{
		indentLevel = 0;
		indent = '';
		col = 0;
		buf = new StringBuf();
		line = new StringBuf();

		printPackage(ast.pack);
		for (type in ast.decls) printType(type);

		return buf.toString();
	}

	function printPackage(pack:Array<String>)
	{
		if (pack.length == 0 && !config.print_root_package) return;

		print('package', SDirective);
		for (i in 0...pack.length)
		{
			if (i == 0) print(' ');
			print(pack[i], SType);
			if (i < pack.length - 1) print('.');
		}

		print(';');
		newline();
		if (config.empty_line_after_package) newline();
	}

	function printType(type:TypeDef)
	{
		switch (type)
		{
			case EImport(sl, mode): printImport(sl, mode);
			case EUsing(path): printUsing(path);

			case EAbstract(data): printAbstract(data);
			case EClass(data): printClass(data);
			case EEnum(data): printEnum(data);
			case ETypedef(data): printTypedef(data);
		}
	}

	function printImport(path:Array<{pack:String, pos:Position}>, mode:ImportMode)
	{
		print('import', SDirective);
		for (i in 0...path.length)
		{
			if (i == 0) print(' ');
			print(path[i].pack, SType);
			if (i < path.length - 1) print('.');
		}

		switch (mode)
		{
			case IAll:
				print('.');
				print('*', SOperator);
			case IAsName(s):
				print(' ');
				print('in', SKeyword);
				print(' ');
				print(s);
			case o:
		}

		print(';');
		newline();
		if (config.empty_line_after_import) newline();
	}

	function printUsing(path:TypePath)
	{
		print('using', SDirective);
		print(' ');
		printTypePath(path);
		print(';');
		newline();
		if (config.empty_line_after_import) newline();
	}

	function printAbstract(data:Definition<AbstractFlag, Array<Field>>)
	{
		trace(data);
	}

	function printClass(type:Definition<ClassFlag, Array<Field>>)
	{
		// if (config.empty_line_before_type) newline();

		// var isInterface = false;
		// var modifiers = [];
		// var ext = null;
		// var impls = [];

		// for (flag in type.flags) switch flag
		// {
		// 	case HInterface: isInterface = true;
		// 	case HExtern: modifiers.push('extern');
		// 	case HPrivate: modifiers.push('private');
		// 	case HExtends(t): ext = t;
		// 	case HImplements(t): impls.push(t);
		// }

		// printModifiers(modifiers);
		// print(isInterface ? 'interface' : 'class', SDirective);
		// print(' ');
		// print(type.name, SType);

		// // type params
		// printTypeParamDecls(type.params);

		// // extends
		// if (ext != null)
		// {
		// 	print(' ');
		// 	breakPoint(config.extends_on_newline);
		// 	print('extends', SKeyword);
		// 	print(' ');
		// 	printTypePath(ext);
		// }

		// // implements
		// if (impls.length > 0)
		// {
		// 	for (impl in impls)
		// 	{
		// 		print(' ');
		// 		breakPoint(config.implements_on_newline);
		// 		print('implements', SKeyword);
		// 		print(' ');
		// 		printTypePath(impl);
		// 	}
		// 	breakPoint(config.implements_on_newline);
		// }

		// // if empty type just print {}
		// if (type.data.length == 0 && config.inline_empty_braces)
		// {
		// 	print(' {}');
		// 	newline();
		// 	return;
		// }

		// if (config.cuddle_type_braces)
		// {
		// 	print(' {');
		// 	newline();
		// 	breakPoint();
		// }
		// else
		// {
		// 	breakPoint();
		// 	newline();
		// 	print('{');
		// 	newline();
		// }

		// setIndent(indentLevel + 1);
		// for (i in 0...type.data.length)
		// {
		// 	printClassField(type.data[i]);
		// 	if (i < type.data.length - 1 && config.empty_line_between_fields) newline();
		// }
		// setIndent(indentLevel - 1);

		// print('}');
		// newline();
	}

	// function printClassField(field:Field)
	// {
	// 	print(indent);

	// 	var modifiers = field.access.map(function(a) return Std.string(a).substr(1).toLowerCase());
	// 	if (config.remove_private_field_modifier) modifiers.remove('private');
	// 	printModifiers(modifiers);

	// 	switch (field.kind)
	// 	{
	// 		case FFun(f): printFunction(field, f);
	// 		case FVar(t, e): printProp(field, null, null, t, e);
	// 		case FProp(get, set, t, e): printProp(field, get, set, t, e);
	// 	}
	// }

	// function printEnum(type:Definition<EnumFlag, Array<EnumConstructor>>)
	// {
	// 	if (config.empty_line_before_type) newline();

	// 	// modifiers
	// 	var modifiers = type.flags.map(function(flag) return Std.string(flag).substr(1).toLowerCase());
	// 	printModifiers(modifiers);

	// 	// declaration
	// 	print('enum', SDirective);
	// 	print(' ');
	// 	print(type.name, SType);

	// 	// type params
	// 	printTypeParamDecls(type.params);

	// 	// if empty type just print {}
	// 	if (type.data.length == 0 && config.inline_empty_braces)
	// 	{
	// 		print(' {}');
	// 		newline();
	// 		return;
	// 	}

	// 	if (config.cuddle_type_braces)
	// 	{
	// 		print(' {');
	// 		newline();
	// 	}
	// 	else
	// 	{
	// 		newline();
	// 		print('{');
	// 		newline();
	// 	}

	// 	setIndent(indentLevel + 1);
	// 	for (i in 0...type.data.length)
	// 	{
	// 		printEnumConstructor(type.data[i]);
	// 		if (i < type.data.length - 1 && config.empty_line_between_enum_constructors) 
	// 			newline();
	// 	}
	// 	setIndent(indentLevel - 1);

	// 	print('}');
	// 	newline();
	// }

	// function printEnumConstructor(ctor:EnumConstructor)
	// {
	// 	print(indent);
	// 	print(ctor.name, SType);
	// 	printTypeParamDecls(ctor.params);
	// 	printEnumConstructorArgs(ctor.args);
	// 	print(';');
	// 	newline();
	// }

	// function printEnumConstructorArgs(args:Array<{name:String, opt:Bool, type:ComplexType}>)
	// {
	// 	if (args.length == 0) return;
	// 	print('(');
	// 	for (i in 0...args.length)
	// 	{
	// 		var arg = args[i];

	// 		if (arg.opt) print('?');
	// 		print(arg.name, SIdent);
	// 		print(':');
	// 		printComplexType(arg.type);
			
	// 		if (i < args.length - 1)
	// 		{
	// 			if (config.space_between_enum_constructor_args) print(', ');
	// 			else print(',');
	// 		}
	// 	}
	// 	print(')');
	// }

	// function printTypedef(type:Definition<EnumFlag, ComplexType>)
	// {
	// 	if (config.empty_line_before_type) newline();

	// 	// modifiers
	// 	var modifiers = type.flags.map(function(flag) return Std.string(flag).substr(1).toLowerCase());
	// 	printModifiers(modifiers);

	// 	// declaration
	// 	print('typedef', SDirective);
	// 	print(' ');
	// 	print(type.name, SType);
	// 	printTypeParamDecls(type.params);
	// 	print(' = ');

	// 	switch (type.data)
	// 	{
	// 		case TAnonymous(fields): printAnonFields(fields);
	// 		case TPath(path): printTypePath(path);
	// 		case _: throw 'todo: ' + type.data;
	// 	}

	// 	newline();
	// }

	// function printAnonFields(fields:Array<Dynamic>)
	// {
	// 	// if empty type just print {}
	// 	if (fields.length == 0 && config.inline_empty_braces)
	// 	{
	// 		print(' {}');
	// 		return;
	// 	}

	// 	if (config.cuddle_type_braces)
	// 	{
	// 		print(' {');
	// 		newline();
	// 	}
	// 	else
	// 	{
	// 		newline();
	// 		print('{');
	// 		newline();
	// 	}

	// 	setIndent(indentLevel + 1);
	// 	for (i in 0...fields.length)
	// 	{
	// 		var field = fields[i];
			
	// 		print(indent);
	// 		print(field.name, SIdent);
	// 		print(':');

	// 		switch (field.kind)
	// 		{
	// 			case FVar(t, _): printComplexType(t);
	// 			case _: throw 'todo: ' + field.kind;
	// 		}

	// 		if (i < fields.length - 1)
	// 		{
	// 			print(',');
	// 			if (config.empty_line_between_typedef_fields) newline();
	// 		}
	// 		newline();
	// 	}
	// 	setIndent(indentLevel - 1);

	// 	print('}');
	// }

	// function printFunction(field:Field, f:Function)
	// {
	// 	print('function', SKeyword);
	// 	print(' ');
	// 	print(field.name, SIdent);
	// 	printTypeParamDecls(f.params);
	// 	printFunctionArgs(f.args);

	// 	if (f.ret != null)
	// 	{
	// 		print(':');
	// 		printComplexType(f.ret);
	// 	}

	// 	if (config.cuddle_method_braces)
	// 	{
	// 		print(' ');
	// 	}
	// 	else
	// 	{
	// 		newline();
	// 		print(indent);
	// 	}
		
	// 	printExpr(f.expr);
	// 	newline();
	// }

	// function printProp(field:Field, get:Null<String>, set:Null<String>, type:Null<ComplexType>, expr:Null<Expr>)
	// {
	// 	print('var', SKeyword);
	// 	print(' ');
	// 	print(field.name, SIdent);
		
	// 	if (get != null && set != null)
	// 	{
	// 		print('(');
	// 		print(get, SModifier);
			
	// 		if (config.space_betwen_property_get_set) print(', ');
	// 		else print(',');

	// 		print(set, SModifier);
	// 		print(')');
	// 	}

	// 	if (type != null)
	// 	{
	// 		print(':');
	// 		printComplexType(type);
	// 	}

	// 	if (expr != null)
	// 	{
	// 		if (config.space_around_property_assign) print(' = ');
	// 		else print('=');
	// 		printExpr(expr);
	// 	}

	// 	print(';');
	// 	newline();
	// }

	// function printExpr(expr:Expr)
	// {
	// 	print(expr.toString().split('\n').join('\n'+indent));
	// }

	// function printFunctionArgs(args:Array<FunctionArg>)
	// {
	// 	print('(');
	// 	breakPoint(config.function_arg_on_newline);

	// 	for (i in 0...args.length)
	// 	{
	// 		breakPoint(config.function_arg_on_newline);

	// 		var arg = args[i];
	// 		if (arg.opt) print('?');
	// 		print(arg.name, SIdent);
			
	// 		if (arg.type != null)
	// 		{
	// 			print(':');
	// 			printComplexType(arg.type);
	// 		}

	// 		if (arg.value != null)
	// 		{
	// 			if (config.space_around_function_arg_assign) print(' = ');
	// 			else print('=');
	// 			printExpr(arg.value);
	// 		}

	// 		if (i < args.length - 1)
	// 		{
	// 			print(',');
	// 			if (config.space_between_function_args) print(' ');
	// 			breakPoint();
	// 		}
	// 	}
	// 	print(')');
	// 	breakPoint();
	// }

	// function printModifiers(modifiers:Array<String>)
	// {
	// 	if (modifiers.length == 0) return;
	// 	var order:Array<String> = config.modifier_order;
	// 	modifiers.sort(function(a,b) return order.indexOf(a) - order.indexOf(b));
		
	// 	for (modifier in modifiers)
	// 	{
	// 		print(modifier, SModifier);
	// 		print(' ');
	// 	}
	// }

	// function printTypePath(path:TypePath)
	// {
	// 	var pack = path.pack.concat([path.name]);
	// 	for (i in 0...pack.length)
	// 	{
	// 		print(pack[i], SType);
	// 		if (i < pack.length - 1) print('.');
	// 	}

	// 	var params = path.params;
	// 	if (params.length == 0) return;
		
	// 	print('<');
	// 	for (i in 0...params.length)
	// 	{
	// 		printTypeParam(params[i]);
	// 		if (i < params.length - 1)
	// 		{
	// 			if (config.space_between_type_params) print(', ');
	// 			else print(',');
	// 		}
	// 	}
	// 	print('>');
	// }

	// function printTypeParamDecls(params:Array<TypeParamDecl>)
	// {
	// 	if (params.length == 0) return;

	// 	print('<');
	// 	for (i in 0...params.length)
	// 	{
	// 		printTypeParamDecl(params[i]);
	// 		if (i < params.length - 1)
	// 		{
	// 			if (config.space_between_type_params) print(', ');
	// 			else print(',');
	// 		}
	// 	}
	// 	print('>');
	// }

	// function printTypeParamDecl(param:TypeParamDecl)
	// {
	// 	print(param.name, SType);
		
	// 	var constraints = param.constraints;
	// 	if (constraints.length == 0) return;

	// 	print(':');
	// 	if (constraints.length > 1) print('(');
	// 	for (i in 0...constraints.length)
	// 	{
	// 		printComplexType(constraints[i]);
	// 		if (i < constraints.length - 1)
	// 		{
	// 			if (config.space_between_type_param_constraints) print(', ');
	// 			else print(',');
	// 		}
	// 	}
	// 	if (constraints.length > 1) print(')');
	// }

	// function printTypeParam(param:TypeParam)
	// {
	// 	switch (param)
	// 	{
	// 		case TPType(type): printComplexType(type);
	// 		case _: throw 'todo: $param';
	// 	}
	// }

	// function printComplexType(type:ComplexType)
	// {
	// 	switch (type)
	// 	{
	// 		case TPath(path): printTypePath(path);
	// 		case TAnonymous(fields): printAnonType(fields);
	// 		case _: throw 'todo: $type';
	// 	}
	// }

	// function printAnonType(fields:Array<Field>)
	// {
	// 	print('{');
	// 	for (i in 0...fields.length)
	// 	{
	// 		var field = fields[i];
	// 		print(field.name, SIdent);
	// 		print(':');

	// 		switch (field.kind)
	// 		{
	// 			case FVar(t, _): printComplexType(t);
	// 			case _: throw 'todo: ' + field.kind;
	// 		}

	// 		if (i < fields.length - 1)
	// 		{
	// 			if (config.space_between_anon_type_fields) print(', ');
	// 			else print(',');
	// 		}
	// 	}
	// 	print('}');
	// }
}

enum Style
{
	SNormal;
	SDirective;
	SOperator;
	SKeyword;
	SIdent;
	SString;
	SNumber;
	SType;
	SModifier;
}
