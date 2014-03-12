import haxeprinter.Config;

@:build(TestFileMacro.build())
/**
	This class comes with a build macro which reads the files in unit/files.
	These files expect a certain structure:
		
	1. The original source
	2. #test
	3. The expected source with default configuration
	4. Any number of #test(configField = value) followed by the expected source
		for the changed configuration.
**/
class TestFile extends TestCommon {
	static var defaultConfig:Config = {
		var config = haxe.Json.parse(haxe.Resource.getString('config-default'));
		config.empty_line_at_end_of_file = false;
		config;
	}
}