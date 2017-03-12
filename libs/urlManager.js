/**
 * Module urlManager
 * @param {string} pathname
 * @returns {object} params
 */
module.exports = {
	rules: {},
	
	parse: function(pathname){
		if (this.isFile(pathname)) return {file: pathname};
		
		var result = this.whatIs(pathname);
		
		return result ? result : {error: '404 Error: '+pathname+' path not recognized'};
	},
	
	isFile: function(pathname){
		for (var i in this.as_file){
			if (pathname.match(this.makeRegExp(this.as_file[i]))) return true;
		}
		return false;
	},
	whatIs: function(pathname){
		var regexp, rule;
		
		for (var i in this.rules)// regexp: path_alias
		{
			rule = this.rules[i];
			regexp = this.makeRegExp(rule.expression);
			
			if (!pathname.match(regexp)) continue;
			
			var path_alias = rule.replace;
			var result = {};
			var v;
			
			for (var type in path_alias){
				v = path_alias[type];
				result[type] = '/' + (v.indexOf('$') > -1 ? pathname.replace(regexp, v) : v);
			}
			
			return result;
		}
		return null;
	},
	
	makeRegExp: function(s){
		return s instanceof RegExp ? s : new RegExp(s);
	}
};