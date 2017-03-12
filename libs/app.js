global.__fs = require('fs');

var h = require('./html');

global.__app = {
	autoload: [],
	layout: '',
	content_placeholder: '<--content-->',
	html_pattern: /<--(.*)-->/g,
	html_part: /<--(.*)-->/,
	types: ['file','module','controller','action'],
	path_aliases: ['ROOT_DIR','MODULES_DIR','CONTROLLERS_DIR','ACTIONS_DIR'],
	
	read: function(f){
		return __fs.readFileSync(f, 'utf-8');
	},
	getView: function(view){
		view = this.read(this.VIEWS_DIR + '/' + view + this.config.viewExt);
		var parts = view.match(this.html_pattern);
		if (parts){
			this.msg(parts);
			for (var i in parts){
				view = view.replace(parts[i], eval(parts[i].replace(this.html_part, '$1')));
			}
		}
		return view;
	},
	
	run: function(params, output){
		this.output = output;
		
		var type, object, name;
		for (var i in this.types){
			type = this.types[i];
			name = params[type];
			
			if (name){
				object = this[type];
				var path = this[this.path_aliases[i]] + name;
				
				if (object && object.name === name){
					this.msg('run '+type+' "'+name+'"');
					object.run(params);
				}
				else try{
					if (type == 'file'){
						this.msg('loading file: '+name);
						this.end(this.read(path));
					}
					else{
						this.msg('create '+type+' "'+name+'"');
						this[type] = new require(path)(params);
					}
					this.line();
				}
				catch(e){
					if (type === 'file'){
						this.lmsg(type+' "'+name+'" was not found');
						return;
					}
					this.lmsg(e);
					this.lmsg(type+' "'+path+'" with params: {'+params.toString()+'} was not found');
				}
				return;
			}
		}
	},
	
	echo: function(msg){
		this.output.write(msg);
	},
	end: function(msg){
		this.output.end(msg);
	},
	render: function(view, params){
		this.vm.create(this.getView(view), params);
	},
	
	setLayout: function(success){
		if (this.layout){
			success(this.layout);
			return;
		}
		
		var result = '';
		var f;
		var async = [];
		
		for (var ext in this.autoload)
		for (var i in this.autoload[ext]){
			f = this.autoload[ext][i];
			
			if (f.indexOf('http') > -1){
				async.push({name: f, ext: ext});
			}
			else{
				result += this.getFile(f, ext);
			}
		}
		
		if (async.length){
			this.renderAsync(async, (res) => {
				this.renderLayout(result + res, success);
			});
		}
		else{
			this.renderLayout(result, success);
		}
	},
	renderLayout: function(head, success){
		this.layout = '<html><head>' + head + '</head><body>'+this.content_placeholder+'</body></html>';
		success(this.layout);
	},
	
	renderAsync: function(arr){
		for (var i in arr){
			__server.requireUrl(arr[i].name, (res) => {
				this.msg(arr[i].name + ' loaded');
			});
		}
	},
	
	getAuto: function(ext){
		return this.autoload.js.map((f) => this.getFile(f, ext)).join();
	},
	checkExt: function(f, ext){
		ext = '.'+ext;
		return f.indexOf(ext) > -1 ? f : f+ext;
	},
	getFile: function(f, ext){
		return this[ 'get' + ext.charAt(0).toUpperCase() + ext.slice(1) ] (f);
	},
	
	getJs: function(f){
		return this.renderJs(this.read(this.checkExt(f, 'js')));
	},
	renderJs: function(content){
		return '<script>'+content+'</script>';
	},
	
	getCss: function(f){
		return this.renderCss(this.read(this.checkExt(f, 'css')));
	},
	renderCss: function(content){
		return '<style>'+content+'</style>';
	},
	
	getComponent: function(){
		
	},
	setComponent: function(type, name){
		
	},
	setComponents(){
		this.msg('components loading:');
		
		var comps = this.config.components;
		var comp;
		
		for (var alias in comps){
			comp = comps[alias];
			
			if (comp.module){
				this[alias] = require(comp.module);
				delete comp.module;
				
				for (var prop in comp){
					this[alias][prop] = comp[prop];
				}
				this.msg('--"'+alias+'" component loaded');
			}
			else{
				this[alias] = comp;
			}
		}
		
		this.line();
	},
	
	msg: function(m){
		__server.msg(m || 'uncatched msg');
	},
	line: function(){
		__server.line();
	},
	lmsg: function(m){
		this.msg(m);
		this.line();
	}
};

module.exports = function(config){
	for (var alias in config){
		__app[alias] = config[alias];
	}
	
	__app.config = require(__app.CONFIG_MAIN);
	
	__app.setComponents();
};