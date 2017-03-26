module.exports = {
	autoload: {
		js: ['https://code.jquery.com/jquery-3.0.0.min.js', 'https://unpkg.com/vue'],
		css: [css+'/style.css']
	},
	
	components: {// allowed from the App object
		urlManager: {
			defaultPath: {action: 'initial_params'}
		}
	}
};