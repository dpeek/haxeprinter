import haxeprinter.Formatter;
import haxeprinter.Config;

@:access(haxeprinter.Formatter)
class TestCommon extends haxe.unit.TestCase {
		
	var currentConfig:Config;
	
	function exprEq(sourceCode:String, expectedCode:String, ?p:haxe.PosInfos) {
		var s = parseExpr(sourceCode, p);
		assertEquals(expectedCode, s, p);
	}
	
	function fileEq(sourceCode:String, expectedCode:String, ?p:haxe.PosInfos) {
		var s = parseFile(sourceCode, p);
		assertEquals(expectedCode, s, p);
	}
	
	function parseExpr(inputCode:String, ?p:haxe.PosInfos) {
		var parser = new Formatter(byte.ByteData.ofString(inputCode), currentConfig, '${p.methodName}:${p.lineNumber}');
		parser.parseExpr();
		return parser.getContent();
	}
	
	function parseFile(inputCode:String, ?p:haxe.PosInfos) {
		var parser = new Formatter(byte.ByteData.ofString(inputCode), currentConfig, '${p.methodName}:${p.lineNumber}');
		parser.parseFile();
		return parser.getContent();
	}
}