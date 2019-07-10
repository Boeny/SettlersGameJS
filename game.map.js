Game.prototype.Map = function(o){
	this.Init(o);
	this.Generate();
};
Game.prototype.Map.prototype = {
	Init: function(o){
		this.parent = o.parent;
		this.rules = o.rules;
		this.width = this.rules.width;
		this.height = this.rules.height;
		this.types =  this.rules.getTypes();
	},
	getWidth: function(){
		return this.width;
	},
	getHeight: function(){
		return this.height;
	},
	getTypes: function(){
		return this.types;
	},
	getData: function(i,j){
		return i === undefined ? this.data : this.data[i+'-'+j];
	},
	getRes: function(i,j){
		return i === undefined ? this.res_data : this.res_data[i+'-'+j];
	},
	isRes: function(i,j){
		if (!is_object(i)) i = this.getData(i,j);
		return in_array(i.type, obj_keys(this.rules.resources));
	},

	Generate: function(){
		this.data = {};
		this.res_data = {};
		this.rules.Init();

		for (var i=0; i<this.getHeight(); i++){
			for (var j=0; j<this.getWidth(); j++){
				var res = this.parent.Validate(this.rules.getRandomRes(i,j), 'random_res');
				this.data[i+'-'+j] = res;
				if (this.isRes(res)) this.res_data[i+'-'+j] = res;
			}
		}

		return this.data;
	}
};
