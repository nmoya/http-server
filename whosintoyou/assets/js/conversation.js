// var statsObject = JSON.parse(localStorage.getItem('localStats'));

function Conversation(conversationId, from, to, toId) {
	this.id = conversationId;
	this.from = from;
	this.to = to;
	this.toId = toId;
}

// class methods
// Foo.prototype.fooBar = function() {

// };
// // export the class
// module.exports = Foo;


function Message(id, from, message, datetime) {
	this.id = id;
	this.from = from;
	this.message = message;
	this.datetime = datetime;
}