window.Rules = function(){
	this.tmp = {
		resources: {}
	};

	for (var i in this.resources){
		this.tmp.resources[i] = this.resources[i].count;
	}

	this.round = 0;
};
Rules.prototype = {
	width: 10,
	height: 10,

	game: {
		prepare: [{objects: {village: 1, road: {count: 1, need: 'village'}, exact_count: 1}}, {order: -1, objects: {village: 1, road: {count: 1, need: 'village'}, exact_count: 1}}]
	},
	resources: {
		stone: {count: 10},
		wood: {count: 13},
		sheep: {count: 13},
		wheat: {count: 13},
		clay: {count: 13}
	},
	cells: {
		//market: {freq: 'resources'},
		//resources: {freq: 'count'},
		sea: {freq:{0: '*', height: '*', '*': [0,-1]}}
	},
	receipts: {
		road: {type:'line',title:'дорога',stone:1,clay:1},
		village: {type:'corner',title:'поселение',road:'from_exist',wheat:1,wood:1,sheep:1,clay:1},
		//town: {type:'corner',title:'город (требуется поселение)',village:'self',stone:3,wheat:2}
	},
	bonuses: {
		village: {resources: 1},
		//town: {resources: 2},
		//market: {exchange: [2,3]},
	},
	market: {
		resources: 1
	},

	setNextRound: function(){
		this.round++;
	},
	getCurrentRule: function(){
		return merge({}, this.game.prepare[this.round] || {});
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
		var keys = obj_keys(all_res);

		if (!keys.length) {
			type = 'cells';
			all_res = this[type];
			keys = obj_keys(all_res);
		}

		var res;

		if (this.cells[type]){
			res = type;
			type = 'cells';
		}
		else{
			res = random_elem(keys);
		}

		if (type === 'resources'){
			all_res[res]--;
			if (!all_res[res]) delete all_res[res];
		}

		return $.extend({}, this[type][res], {name: res});
	}
};
