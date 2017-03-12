var paths = {};

function setPaths(root, obj){
	for (var alias in obj){
		paths[alias] = root + obj[alias];
	}
}

setPaths(__dirname, {
	ROOT_DIR	: '',
	CONFIG_DIR	: '/config',
	LIBS_DIR	: '/libs',
	MODULES_DIR	: '/modules',
	CONTROLLERS_DIR	: '/controllers',
	ACTIONS_DIR	: '/actions',
	VIEWS_DIR	: '/views',
	VENDORS_DIR	: '/vendors',
	LAYOUT_DIR	: '/layouts'
});

setPaths(paths.CONFIG_DIR, {
	CONFIG_MAIN		: '/main'
});

setPaths(paths.LIBS_DIR, {
	APP		: '/app'
});

setPaths(paths.VENDORS_DIR, {
	VUE_DIR	: '/vue'
});

setPaths(paths.VUE_DIR, {
	VUE				: '/vue.server',
	VUE_RENDERER	: '/vue.server.renderer'
});

module.exports = paths;