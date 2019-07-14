var http = require('http');
var dispatcher = require('./dispatcher');
var port = 80;

var after_start = function(){
	console.log(`server was started on port ${port}`);
};

module.exports.start = function(route){
	http.createServer(dispatcher(route)).listen(port, '127.0.0.1', after_start);
};
