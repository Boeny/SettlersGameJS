/**
 * Module urlManager
 * @param {string} pathname
 * @returns {object} params
 */
module.exports = {
	parse: function(pathname){
		var regexp;
		
		for (var expression in this.rules)// regexp: path_alias
		{
			regexp = new RegExp(expression, 'g');
			if (!pathname.match(regexp)) continue;
			
			var path_alias = this.rules[expression];
			var result = {};
			
			for (var key in path_alias){
				result[key] = pathname.replace(regexp, path_alias[key]);
			}
			
			return result;
		}
		
		return {
			error: '404 Error: '+pathname+' path not recognized'
		};
	}
};