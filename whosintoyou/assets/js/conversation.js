// local = localStorage.getItem('localStats')
// var statsObject = JSON.parse(JSON.parse(local).stats);
function Conversation(conversationId, from, to, toId) {
	this.id = conversationId;
	this.from = from;
	this.to = to;
	this.toId = toId;
}

function Message(id, from, message, datetime) {
	this.id = id;
	this.from = from;
	this.message = message;
	this.datetime = datetime;
}

// class methods
// Foo.prototype.fooBar = function() {

// };
// // export the class
// module.exports = Foo;