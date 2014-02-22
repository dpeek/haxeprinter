package haxeprinter;

import haxe.macro.Context;
import haxe.macro.Expr;
import haxe.macro.Type;

using haxe.macro.Tools;
using Lambda;

class Macro {
	static public function generateConfigTemplate() {
		var t = Context.getType("haxeprinter.Config");
		var sFields = [];
		switch(t.follow()) {
			case TAnonymous(anon):
				var fields = anon.get().fields;
				for (field in fields) {
					var def = field.meta.get().find(function(meta) return meta.name == ":default");
					var sDef = def.params[0].toString();
					sFields.push('"${field.name}":$sDef');
				}
			case _:
				throw false;
		}
		sFields.sort(Reflect.compare);
		var s = "{\n\t" + sFields.join(",\n\t") + "\n}";
		sys.io.File.saveContent("res/config-default.json", s);
	}
}