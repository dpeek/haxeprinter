package haxeprinter;

import hxparse.NoMatch;
import hxparse.Unexpected;

class Main
{
	static function main()
	{
		var path = Sys.args()[0];
		
		if (path == null)
		{
			Sys.println('No source file provided');
			Sys.exit(1);
		}

		if (!sys.FileSystem.exists(path))
		{
			Sys.println('Source file "$path" does no exist');
			Sys.exit(1);
		}

		formatPath(path);
	}

	static function formatPath(path:String)
	{
		if (sys.FileSystem.isDirectory(path))
		{
			for (file in sys.FileSystem.readDirectory(path))
				formatPath('$path/$file');
		}
		else
		{
			if (path.indexOf('formatted') > -1) return;
			if (new haxe.io.Path(path).ext != 'hx') return;

			var outputPath = haxe.io.Path.withExtension(path, 'formatted.hx');
			sys.io.File.saveContent(outputPath, formatSource(path));
		}
	}

	static function formatSource(path:String)
	{
		var source = sys.io.File.getContent(path);
		var input = byte.ByteData.ofString(source);
		var formatter = new haxeprinter.Formatter(input, haxe.Json.parse(haxe.Resource.getString('config')), path);
		
		var output = try {
			formatter.getContent();
		} catch(e:NoMatch<Dynamic>) {
			throw e.pos.format(input) + ": Unexpected " +e.token.tok;
		} catch(e:Unexpected<Dynamic>) {
			throw e.pos.format(input) + ": Unexpected " + e.token.tok;
		}

		return output;
	}
}
