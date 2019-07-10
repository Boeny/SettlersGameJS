Game.prototype.Rules = function(){
	this.tmp = {
		resources: {}
	};

	for (var i in this.resources){
		this.tmp.resources[i] = this.resources[i].count || this.resources[i];
	}

	this.round = 0;
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

	getTypes: function(){
		return obj_keys(this.objects);
	},
	getPlace: function(type){
		return this.objects[type].place;
	},

	setNextRound: function(){
		this.round++;
	},
	getCurrentRule: function(){
		var rule = merge({}, this.game.prepare[this.round] || {});
		if (!rule.objects) return rule;

		for (var type in rule.objects){
			var obj = rule.objects[type];
			var is_obj = is_object(obj);

			rule.objects[type] = {
				count: is_obj ? obj.count : obj,
				need: is_obj && obj.place ? this.getPlace(type) : null,
				type: type
			};
		}

		return rule;
	},

	getReceipts: function(){
		var result = [];
		var receipts_names = obj_keys(this.receipts);

		for (var type in this.receipts){
			var obj = this.receipts[type];
			var obj_info = this.objects[type];
			var receipt = [];

			for (var res in obj){
				if (in_array(res, receipts_names)) continue;

				receipt.push({
					resource: res,
					type: type,
					count: obj[res],
					title: obj_info.title
				});
			}

			result.push(receipt);
		}

		return result;
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
		var all_res = this.tmp[type] || this.cells;
		var names = obj_keys(all_res);

		if (!names.length) {
			all_res = this.cells;
			names = obj_keys(all_res);
		}

		var res = random_elem(names);

		if (type === 'resources')
		{
			all_res[res]--;
			if (!all_res[res]) delete all_res[res];
		}

		return {type: res};
	}
};
