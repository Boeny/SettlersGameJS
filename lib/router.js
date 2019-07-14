exports.route = function(path, response){
	var handler = app.urlManager;
	handler = typeof handler === 'function' ? handler(path) : handler[handler.method](path);

	if (!handler || handler.error){
		app.error(handler && handler.error);
		return;
	}

	// caching
	for (var key in handler){
		app[key] = app.getComponent(handler[key]);
	}

	app.run();
};
