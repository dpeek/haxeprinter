package haxeprinter;

import haxe.macro.Context;
import haxe.macro.Expr;
import haxe.macro.Type;

using haxe.macro.Tools;
using Lambda;
using StringTools;

class Macro {
	static public function generateConfigTemplate() {
		function loop(t:Type, path, tabs) {
			var sFields = [];
			var l = path.split(".").length + 1;
			var tabs2 = tabs + "\t";
			switch(t.follow()) {
				case TAnonymous(anon):
					var fields = anon.get().fields;
					for (field in fields) {
						var def = field.meta.get().find(function(meta) return meta.name == ":default");
						var s = if (def == null) {
							" " + loop(field.type, path == "" ? field.name : '$path.${field.name}', tabs2);
						} else {
							def.params[0].toString();
						}
						sFields.push('$tabs2"${field.name}": $s');
					}
				case _:
					throw false;
			}
			sFields.sort(function(s1, s2) return if (s1.endsWith("}")) -1 else if (s2.endsWith("}")) 1 else Reflect.compare(s1,s2));
			return "{\n" + sFields.join(",\n") + "\n" + tabs + "}";
		}
		var s = loop(Context.getType("haxeprinter.Config"), "", "");
		sys.io.File.saveContent("res/config-default.json", s);
	}
}