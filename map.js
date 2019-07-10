window.Map = function(o){

};
Map.prototype = {
	getWidth: function(){
		return this.rules.width;
	},
	getHeight: function(){
		return this.rules.height;
	},

	getData: function(i,j){
		return i === undefined ? this.data : this.data[i+'-'+j];
	},
	Generate: function(rules){
		this.rules = rules;
		this.data = {};
		this.res_data = {};

		for (var i=0; i<this.getHeight(); i++){
			for (var j=0; j<this.getWidth(); j++){

				this.data[i+'-'+j] = this.rules.getRandomRes(i,j);
			}
		}
		return this.data;
	},

	isRes: function(i,j){
		if (!is_object(i)) i = this.getData(i,j);
		if (!i) return false;
		return in_array(i.name, obj_keys(this.rules.resources));
	}
};
