/**
 * Module dispatcher
 * @param {function} route
 * @returns {function} handler on request event
 */
var url = require('url');

module.exports = function(route){
	return function(request, response){
		var pathname = url.parse(request.url).pathname;
		console.log(`Request for ${pathname} received.`);
		route(pathname, response);
	};
};
