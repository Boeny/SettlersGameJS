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
	var params = __app.urlManager[__app.urlManager.method](path);
	
	if (!params || params.error){
		__app.lmsg(params && params.error);
		return;
	}
	
	__app.run(params, response);
};