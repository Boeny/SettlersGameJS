var fs = require('fs');
var h = require('./html');

global.__app = {
	autoload: [],
	layout: '',
	lang: 'ru',
	head: '',
	title: '',
	content: '',
	content_placeholder: '<--content-->',
	html_pattern: /<--(.*)-->/g,
	html_part: /<--(.*)-->/,
	types: ['file','module','controller','action'],
	path_aliases: ['ROOT_DIR','MODULES_DIR','CONTROLLERS_DIR','ACTIONS_DIR'],
	
	readRaw: function(f){
		return fs.readFileSync(f);
	},
	read: function(f){
		return fs.readFileSync(f, 'utf-8');
	},
	getView: function(view, dir_alias){
		view = this.read(this[dir_alias || 'VIEWS_DIR'] + '/' + view + this.config.viewExt);
		var parts = view.match(this.html_pattern);
		if (parts){
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
						this.msg();
						this.end(this.readRaw(path));
					}
					else{
						this.msg('create '+type+' "'+name+'"');
						this[type] = new require(path)(params);
					}
					this.line();
				}
				catch(e){
					if (type === 'file'){
						this.msg(e);
						this.lmsg(type+' "'+name+'" was not found');
						return;
					}
					this.lmsg(e);
					this.lmsg(type+' "'+path+'" was not found');
				}
				return;
			}
		}
	},
	
	end: function(msg){
		this.output.end(msg);
	},
	render: function(view, params){
		this.vm.create(this.getView(view), params);
	},
	
	writeHead: function(code, type){
		this.output.writeHead(code || 200, {'Content-Type': type || 'text/html'});
	},
	getMetas: function(){
		return	h.meta({charset: 'utf-8'})+
				h.meta({'http-equiv': 'X-UA-Compatible', content: 'IE=edge'})+
				h.meta({name: 'viewport', content: 'width=device-width, initial-scale=1'});
	},
	setLayout: function(success){
		if (this.layout){
			success(this.layout);
			return;
		}
		
		this.head = this.getMetas() + h.title(this.title);
		var f;
		var async = [];
		
		for (var ext in this.autoload)
		for (var i in this.autoload[ext]){
			f = this.autoload[ext][i];
			
			if (f.indexOf('http') > -1){
				async.push({name: f, ext: ext});
			}
			else{
				this.head += this.getFile(f, ext);
			}
		}
		
		if (async.length){
			this.renderAsync(async, (res) => {
				this.head += res;
				success();
			});
		}
		else{
			success();
		}
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
		__server.msg(m || '---');
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