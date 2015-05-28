var sampleJSON = "[{'id': '329465960445648_1432085429','from': 'Nikolas Moya','message': 'te amo','datetime': '2015-05-20T01:30:29+0000'}, {'id': '329465960445648_1432087008',	'from': 'Marilia Ferreira',	'message': 'Pa não me atende???',	'datetime': '2015-05-20T01:56:48+0000'}, {'id': '329465960445648_1432087317',	'from': 'Nikolas Moya',	'message': 'por onde vc ta me ligando?',	'datetime': '2015-05-20T02:01:57+0000'}, {	'id': '329465960445648_1432087454',	'from': 'Nikolas Moya',	'message': 'agora vc nao me atende','datetime': '2015-05-20T02:04:14+0000'}]";
var sampleJSON2 = {
	"data": [{
		"id": "329465960445648_1432085429",
		"from": "Nikolas Moya",
		"message": "te amo",
		"datetime": "2015-05-20T01:30:29+0000"
	}, {
		"id": "329465960445648_1432087008",
		"from": "Marilia Ferreira",
		"message": "Pa não me atende???",
		"datetime": "2015-05-20T01:56:48+0000"
	}, {
		"id": "329465960445648_1432087317",
		"from": "Nikolas Moya",
		"message": "por onde vc ta me ligando?",
		"datetime": "2015-05-20T02:01:57+0000"
	}]
};

function Conversation(id, from, to) {
	this.id = id;
	this.from = from;
	this.to = to;
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