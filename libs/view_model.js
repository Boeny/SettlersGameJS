var Vue = require(__app.VUE);
__app.msg('--vue loaded');
var renderer = require(__app.VUE_RENDERER).createRenderer();
__app.lmsg('--vue-renderer loaded');

module.exports = {
	instance: null,
	
	create: function(template, params){
		var app = new Vue({
			template: template,
			data: params
		});
		
		renderer.renderToString(app, function (error, html) {
				if (error) {
					console.error(error);
					return __app.output.status(500).send('Server Error');
				}
				
				__app.setLayout(function(layout){
					__app.end(layout.replace(__app.content_placeholder, html));
				});
			}
		);
	}
};