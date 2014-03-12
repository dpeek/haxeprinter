import haxeprinter.Formatter;
import haxeprinter.Config;

@:access(haxeprinter.Formatter)
class TestCommon extends haxe.unit.TestCase {
		
	function exprEq(sourceCode:String, config:Config, expectedCode:String, ?p:haxe.PosInfos) {
		var s = parseExpr(sourceCode, config, p);
		assertEquals(expectedCode, s, p);
	}
	
	function fileEq(sourceCode:String, config:Config, expectedCode:String, ?p:haxe.PosInfos) {
		var s = parseFile(sourceCode, config, p);
		assertEquals(expectedCode, s, p);
	}
	
	static function parseExpr(inputCode:String, config:Config, ?p:haxe.PosInfos) {
		var parser = new Formatter(byte.ByteData.ofString(inputCode), config, '${p.methodName}:${p.lineNumber}');
		parser.parseExpr();
		return parser.getContent();
	}
	
	static function parseFile(inputCode:String, config:Config, ?p:haxe.PosInfos) {
		var parser = new Formatter(byte.ByteData.ofString(inputCode), config, '${p.methodName}:${p.lineNumber}');
		parser.parseFile();
		return parser.getContent();
	}
}