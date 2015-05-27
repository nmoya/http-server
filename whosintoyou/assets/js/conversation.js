function Conversation(id, from, to)
{
	this.id = id;
	this.from = from;
	this.to = to;
}

// class methods
// Foo.prototype.fooBar = function() {

// };
// // export the class
// module.exports = Foo;


function Message(id, from, message, datetime)
{
	this.id = id;
	this.from = from;
	this.message = message;
	this.datetime = datetime;
}