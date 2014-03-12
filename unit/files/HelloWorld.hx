package files;

class HelloWorld {

	public function new() {
		trace("Hello World");
	}

}

#test

package files;
class HelloWorld
{
	public function new()
	{
		trace("Hello World");
	}
}

#test(cuddle_type_braces = true)

package files;
class HelloWorld {

public function new()
	{
		trace("Hello World");
	}
}