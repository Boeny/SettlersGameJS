Game.prototype.Map = function(o){

};
Game.prototype.Map.prototype = {
	getWidth: function(){
		return this.rules.width;
	},
	getHeight: function(){
		return this.rules.height;
	},
	getTypes: function(){
		return this.rules.getTypes();
	},
	getData: function(i,j){
		return i === undefined ? this.data : this.data[i+'-'+j];
	},
	getRes: function(){
		return i === undefined ? this.res_data : this.res_data[i+'-'+j];
	},
	isRes: function(i,j){
		if (!is_object(i)) i = this.getData(i,j);
		return in_array(i.type, obj_keys(this.rules.resources));
	},

	Generate: function(rules){
		this.rules = rules;
		this.data = {};
		this.res_data = {};

		for (var i=0; i<this.getHeight(); i++){
			for (var j=0; j<this.getWidth(); j++){
				var res = this.rules.getRandomRes(i,j);
				this.data[i+'-'+j] = res;
				if (this.isRes(res)) this.res_data[i+'-'+j] = res;
			}
		}

		return this.data;
	}
};
