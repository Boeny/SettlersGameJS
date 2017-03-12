var root = __app.LIBS_DIR;
var css = __app.LAYOUT_DIR;

module.exports = {
	viewExt: '.html',
	
	components: {// allowed from the __app
		autoload: {
			//js: ['https://code.jquery.com/jquery-3.0.0.min.js', 'https://unpkg.com/vue'],
			css: [css+'/style.css']
		},
		
		_: {module: root+'/base'},
		vm: {module: root+'/view_model'},
		
		request: {module: root+'/requestManager'},
		
		urlManager: {
			module: root+'/urlManager',
			method: 'parse',
			//urlSuffix: '.html',
			as_file: [
				/\/favicon.ico/,
				/\/images\/.*/
			],
			// array because the order is important
			rules: [
				{expression: /^\/$/,				replace: {action: 'initial_params'}},
				{expression: /^\/(\w+)\/(\w+)\/(\w+)/,	replace: {module: '$1', controller: '$2', action: '$3'}},
				{expression: /^\/(\w+)\/(\w+)/,		replace: {controller: '$1', action: '$2'}},
				{expression: /^\/(\w+)/,				replace: {action: '$1'}}
			]
		}
	}
};