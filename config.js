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
	ACTIONS_DIR	: '/actions'
});

setPaths(paths.CONFIG_DIR, {
	CONFIG_MAIN		: '/main'
});

setPaths(paths.LIBS_DIR, {
	APP		: '/app'
});

module.exports = paths;