var config = require('./config');
require(config.APP)(config);

Object.prototype.toString = function(){
	var result = [];
	for (var i in this){
		result.push(i+': '+this[i]);
	}
	return result.join(', ');
};
/*Object.prototype.key = function(i){
	return Object.keys(this)[i || 0];
};*/

module.exports = function(path, response){
	var params = __app.urlManager[__app.urlManager.method](path);
	
	if (!params || params.error){
		__app.lmsg(params && params.error);
		return;
	}
	
	__app.run(params, response);
};