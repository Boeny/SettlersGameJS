Game.prototype.Map = function(o){
	this.Init(o);
	//this.Generate();
};
Game.prototype.Map.prototype = {
	Init: function(o){
		this.parent = o.parent;
		this.rules = o.rules;
		this.types =  this.rules.getTypes();
		this.dices = {};
	},
	getWidth: function(){
		return this.rules.width;
	},
	getHeight: function(){
		return this.rules.height;
	},
	getTypes: function(){
		return this.types;
	},
	getData: function(i,j){
		if (is_array(i)){
			j = i[1];
			i = i[0];
		}
		return i === undefined ? this.data : this.data[i+'-'+j];
	},
	getDices: function(){
		return this.dices;
	},
	getRes: function(i,j){
		if (is_array(i)){
			j = i[1];
			i = i[0];
		}
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
				if (this.isRes(res)){
					this.res_data[i+'-'+j] = res;
					this.dices[i+'-'+j] = this.rules.getRandomDice();
				}
			}
		}

		return this.data;
	},

	getCellsByDice: function(digit){
		var result = {};

		for (var coo in this.dices){
			if (this.dices[coo].digit == digit)
				result[coo] = this.data[coo];
		}

		return result;
	}
};
