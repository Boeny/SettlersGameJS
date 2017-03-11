var config = require('./config');
require(config.APP)(config);

Object.prototype.toString = function(){
	var result = [];
	for (var i in this){
		result.push(i+': '+this[i]);
	}
	return result.join(', ');
};

module.exports = function(path, response){
	var handler = __app.urlManager;
	var params = typeof handler === 'function' ? handler(path) : handler[handler.method](path);
	
	if (!params || params.error){
		__app.error(params && params.error);
		return;
	}
	
	__app.Run(params, response);
};