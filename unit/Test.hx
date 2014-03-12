class Test {
	static public function main() {
		var runner = new haxe.unit.TestRunner();
		runner.add(new TestExpr());
		runner.add(new TestFile());
		runner.run();
	}
}