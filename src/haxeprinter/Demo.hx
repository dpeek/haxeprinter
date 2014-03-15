package haxeprinter;

import js.Browser.document;
import js.Browser.window;
import hxparse.NoMatch;
import hxparse.Unexpected;

class Demo
{
	static var cfg:Config;
	
	static function main()
	{
		var input = document.getElementById('input');
		var output = document.getElementById('output');
		var config = document.getElementById('config');

		cfg = haxe.Json.parse(haxe.Resource.getString('config-default'));
		
		var cfg2 = haxe.Json.parse(haxe.Resource.getString('config'));
		for (field in Reflect.fields(cfg2)) {
			if (!Reflect.hasField(cfg, field)) {
				throw 'Invalid config field: $field';
			}
			Reflect.setField(cfg, field, Reflect.field(cfg2, field));
		}
		
		var html = '<form>';
		function loop(obj:{}, path:String) {
			for (field in Reflect.fields(obj))
			{
				var label = field.split('_').join(' ');
				var value:Dynamic = Reflect.field(obj, field);
				var name = path == "" ? field : path + "." + field;
				if (value == true || value == false)
				{
					var checked = value ? ' checked' : '';
					html += '<fieldset><input type="checkbox" name="$name"$checked/></input<label for="$field">$label</label></fieldset>';
				} else {
					// TODO: I guess not all non-bool fields are sub-categories
					html += "<ul>" + label;
					loop(value, name);
					html += "</ul>";
				}
			}
		}
		loop(cfg, "");
		config.innerHTML = html + '</form>';
		config.onclick = function(e) {
			if (e.target.tagName != 'INPUT') return;
			var name:String = e.target.getAttribute('name');
			var value = e.target.checked;
			var split = name.split(".");
			var obj = cfg;
			while(split.length > 1) {
				obj = Reflect.field(obj, split.shift());
			}
			Reflect.setField(obj, split.shift(), value);
			update();
		}

		input.oninput = function(e) update();
		input.innerText = haxe.Resource.getString('source');
		update();
	}

	static function update()
	{
		var input = document.getElementById('input');
		var output = document.getElementById('output');
		output.innerHTML = format(input.innerText);
	}

	static function format(source:String)
	{
		var input = byte.ByteData.ofString(source);
		var formatter = new Formatter(input, cfg, "foo/bar/TestSource.hx");

		var output = try {
			formatter.getContent();
		} catch(e:NoMatch<Dynamic>) {
			return '<span class="error">' + e.pos.format(input) + ": Unexpected " +e.token.tok + '</span>';
		} catch(e:Unexpected<Dynamic>) {
			return '<span class="error">' +e.pos.format(input) + ": Unexpected " + e.token.tok + '</span>';
		} catch(e:Dynamic) {
			return '<span class="error">unknown error $e</span>';
		}

		return output;
	}
}