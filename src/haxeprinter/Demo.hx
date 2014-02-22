package haxeprinter;

import js.Browser.document;
import js.Browser.window;
import hxparse.NoMatch;
import hxparse.Unexpected;

class Demo
{
	static var cfg;
	
	static function main()
	{
		var input = document.getElementById('input');
		var output = document.getElementById('output');
		var config = document.getElementById('config');

		cfg = new Formatter.Config();
		
		var html = '<form>';
		for (field in Reflect.fields(cfg))
		{
			var label = field.split('_').join(' ');
			var value = Reflect.field(cfg, field);
			if (value == true || value == false)
			{
				var checked = value ? ' checked' : '';
				html += '<fieldset><input type="checkbox" name="$field"$checked/></input<label for="$field">$label</label></fieldset>';
			}
		}
		config.innerHTML = html + '</form>';
		config.onclick = function(e) {
			if (e.target.tagName != 'INPUT') return;
			var name = e.target.getAttribute('name');
			var value = e.target.checked;
			Reflect.setField(cfg, name, value);
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
		output.innerHTML = StringTools.htmlEscape(format(input.innerText));
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
			return '<span class="error">unknown error</span>';
		}

		return output;
	}
}