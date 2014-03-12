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
}

/*
	Enum
*/
extern enum MyEnum
{
	MyEnumValue;
}