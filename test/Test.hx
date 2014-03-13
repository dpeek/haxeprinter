/*
	Comment
*/
package/* Comment */pack.pack;// CommentLine

/*
	Empty type
*/
#if js class EmptyClass
{
}
#end

/*
	Class
*/
extern #if js private #end class MyClass extends SuperClass implements Interface
{
	/*
		Comment
	*/
	var variable:Int = 0;

	/*
		Comment
	*/
	var property(get, set):Int = 0;

	public function doThings()
	{
		var foo = 10;

		// things being done
		function inlineFunc(){}

		var a = -1 + 2 / 3;
		a += 1;
		a++;

		if (flag1 == true || (flag2 != true && flag3 < 1)) {
			inlineFunc();
		} else if (true) {
			// foo
		} else {
			// bar
		}

		for (i in 0...10) {
			a += 10;
			trace("Hello");
		}

		while (false) {
			trace("Hello");
		}

		do {
			trace("Boo");
		} while (false)

		switch (foo) {
			case "bar":
			default:
		}

		try {
			things();
		} catch (e:Dynamic) {
			otherThings();
		}
	}
}

/*
	Enum
*/
extern enum MyEnum
{
	MyEnumValue;
}