global.__app = {
	module: null,
	controller: null,
	action: null,
	
	Run: function(params, output){
		this.output = output;
		
		/*if (params.module){
			this.module = new require(this.MODULES_DIR + '/' + params.module)(params);
			return;
		}
		if (params.controller){
			this.controller = new require(this.CONTROLLERS_DIR + '/' + params.controller)(params);
			return;
		}
		if (params.action){
			this.action = new require(this.ACTIONS_DIR + '/' + params.action)();
			return;
		}*/
		
		this.end(params.toString());
	},
	
	end: function(msg){
		this.output.end(msg);
	},
	render: function(view){
		this.end(fs.readFileSync(view));
	},
	
	getComponent: function(){
		
	},
	setComponent: function(type, name){
		
	},
	error: function(msg){
		console.log(msg || 'uncatched error');
	}
};

function setComponents(comps){
	var comp;
	
	for (var alias in comps){
		comp = comps[alias];
		
		__app[alias] = require(__app.ROOT_DIR + comp.module);
		delete comp.module;
		
		for (var prop in comp){
			__app[alias][prop] = comp[prop];
		}
	}
}

module.exports = function(config){
	for (var alias in config){
		__app[alias] = config[alias];
	}
	
	__app.config = require(__app.CONFIG_MAIN);
	
	setComponents(__app.config.components);
};