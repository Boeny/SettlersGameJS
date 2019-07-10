Game.prototype.Rules = function(){
	this.Init();
};
Game.prototype.Rules.prototype = {
	width: 10,
	height: 10,

	game: {
		prepare: [{objects: {village: 1, road: {count: 1, place: true}}}, {order: -1, objects: {village: 1, road: {count: 1, place: true}}}]
	},
	resources: {
		stone: 10,
		wood: 13,
		sheep: 13,
		wheat: 13,
		clay: 13
	},
	cells: {
		//market: {freq: 'resources'},
		//resources: {freq: 'count'},
		sea: {freq:{0: '*', height: '*', '*': [0,-1]}}
	},
	receipts: {
		road: {stone:1,clay:1},
		village: {wheat:1,wood:1,sheep:1,clay:1},
		//town: {village:1,stone:3,wheat:2}
	},
	objects: {
		road: {title:'дорога',place:['road','village']},
		village: {title:'поселение',place:'road'},
		//town: {title:'город (требуется поселение)',replace:'village'}
	},
	bonuses: {
		village: {resources: 1},
		//town: {resources: 2},
		//market: {exchange: [2,3]},
	},
	market: {
		resources: 1
	},

	Validate: function(v, type){
		switch(type){
			case 'random_res':
				if (!v.type) _Error.ThrowType('random res type is undefined', type);
			break;

			case 'map':
				if (v.width * v.height !== obj_length(v.data))
				_Error.ThrowType('map data is less than mult of width & height', type);
			break;

			case 'receipts':
				_Error.ThrowTypeIf(!v || !v.length, 'receipts for description are empty', type);
			break;

			case 'rule':
				if (in_array(this.round, [0,1])){
					var need = v.objects.road.need;
					if (!need || !need.length){
						_Error.ThrowType('something wrong with road need, round='+this.round, type);
					}
				}
			break;

			case 'current_player':
				if (!v) _Error.ThrowType('player index is wrong', type);
			break;
		}

		return v;
	},

	getTypes: function(){
		return obj_keys(this.objects);
	},
	getPlace: function(type){
		return copy_elements([], to_arr(this.objects[type].place));
	},

	setNextRound: function(){
		this.round++;
	},
	getCurrentRule: function(){
		var result = {objects: {}};
		var rule = this.game.prepare[this.round];

		for (var type in rule.objects){
			var obj = rule.objects[type];
			var is_obj = is_object(obj);

			result.objects[type] = {
				count: is_obj ? obj.count : obj,
				need: is_obj && obj.place ? this.getPlace(type) : null,
				type: type
			};
		}

		return result;
	},

	getReceipts: function(){
		var result = [];
		var receipts_names = obj_keys(this.receipts);

		for (var type in this.receipts){
			var receipt = {
				type: type,
				title: this.objects[type].title,
				resources: []
			};

			var obj = this.receipts[type];

			for (var res in obj){
				if (in_array(res, receipts_names)) continue;

				receipt.resources.push({
					type: res,
					count: obj[res]
				});
			}

			result.push(receipt);
		}

		return result;
	},

	Init: function(){
		this.tmp = {
			resources: {},
			res_by_count: [],
			cells: {}
		};

		for (var i in this.resources){
			this.tmp.resources[i] = this.resources[i].count || this.resources[i];

			for (var j=0; j<this.tmp.resources[i]; j++){
				this.tmp.res_by_count.push(i);
			}
		}

		for (var i in this.cells){
			this.tmp.cells[i] = this.cells[i].count;
		}

		this.round = 0;
	},
	getCellType: function(i,j){
		var c = {};// conditions[cell]

		for (var key in this.cells){
			c[key] = [];
			var freq = this.cells[key].freq;

			for (var h in freq){
				var delta = freq[h];

				if (is_array(delta)){
					for (var d in delta){
						if (in_str('*',delta[d])){
							delta[d] = delta[d].split('*')[1];
						}

						if (delta[d] < 0){
							delta[d] += this.width;
						}
					}
				}
				switch (h){
					case 'height':
						if (i == this.height && delta == '*') c[key].push(true);
						break;
					case '*':
						if (is_array(delta) && in_array(j, delta)) c[key].push(true);
						break;
					default:
						if (i == +h && delta == '*') c[key].push(true);
				}
			}
		}

		var max_key = {max: 0, key: ''};

		for (var key in c){
			if (c[key].length > max_key.max){
				max_key = {
					key: key,
					max: c[key].length
				}
			}
		}

		return max_key.max ? max_key.key : 'resources';
	},
	getRandomRes: function(i,j){
		var type = this.getCellType(i,j);
		var all_res = this.tmp[type] || this.tmp.cells;
		var names = type === 'resources' ? this.tmp.res_by_count : obj_keys(all_res);

		if (!names.length) {
			type = 'cells';
			names = obj_keys(this.cells);
		}

		var res = random_elem(names);

		if (type === 'resources')
		{
			names.splice(names.indexOf(res), 1);
		}

		return {type: res};
	}
};
