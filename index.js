var http = require('http');
var fs = require('fs');
var port = 80;

var dispatcher = function(request, response){
	//var Router = require('router');
	//var data = (new Router(request.url));
	response.end(fs.readFileSync('./index.html'));
};

var after_start = function(){
	console.log(`server was started on port ${port}`);
};

http.createServer(dispatcher).listen(port, '127.0.0.1', after_start);
