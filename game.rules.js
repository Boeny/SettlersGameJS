Game.prototype.Rules = function(w,h){
	this.setSize(w,h);
};
Game.prototype.Rules.prototype = {
	width: 10,
	height: 10,

	game: {
		prepare: [
			{objects: {village: 1, road: {count: 1, place: true}}},
			{order: -1, objects: {village: 1, road: {count: 1, place: true}}}
		],
		main: {objects: {village: {place: true}, road: {place: true}}}
	},
	resources: {
		stone: 3,
		wood: 2,
		sheep: 2,
		wheat: 1,
		clay: 1
	},
	cells: {
		//market2: {freq: 'resources'},
		//market3: {freq: 'resources'},
		//resources: {freq: 'count'},
		sea: {freq:{0: '*', '*': [0,-1], height: '*'}}
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
		//market2: {exchange: 2},
		//market3: {exchange: 3}
	},
	exchange: {
		resources: 4
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
	getBonuses: function(type){
		return this.bonuses[type];
	},
	getReceipt: function(type){
		return this.receipts[type];
	},
	getExchange: function(){
		var result = {};
		var res, type;

		for (var extype in this.exchange){
			res = obj_keys(this[extype]);

			for (var i in res){
				type = res[i];

				result[type] = {
					count: this.exchange[extype],
					res: arr_exclude(res, type)
				};
			}
		}

		return result;
	},

	setNextRound: function(){
		this.round++;
	},
	getPrepareStep: function(){
		return this.game.prepare[this.round];
	},
	getCurrentRule: function(){
		var result = {objects: {}};
		var rule = this.getPrepareStep();
		var is_main = !rule;
		if (is_main) rule = this.game.main;

		for (var type in rule.objects){
			var obj = rule.objects[type];
			var is_obj = is_object(obj);

			result.objects[type] = {
				count: is_obj ? obj.count : obj,
				need: is_obj && obj.place ? this.getPlace(type) : null,
				receipt: is_main ? this.getReceipt(type) : null,
				type: type
			};
			result.exchange = this.getExchange();
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

	setSize: function(w,h){
		this.width = +w || this.width;
		this.height = +h || this.height;
	},
	Init: function(){
		this.tmp = {
			resources: {},
			res_by_count: [],
			cells: {}
		};

		var count = (this.width - 2) * (this.height - 2);
		var actual_count = 0;

		for (var i in this.resources){
			this.tmp.resources[i] = this.resources[i].count || this.resources[i];
			actual_count += this.tmp.resources[i];
		}

		var koef = count / actual_count;

		for (var i in this.resources){
			this.tmp.resources[i] = parseInt(this.tmp.resources[i] * koef);

			for (var j=0; j<this.tmp.resources[i]; j++){
				this.tmp.res_by_count.push(i);
			}
		}

		for (var i in this.cells){
			this.tmp.cells[i] = this.cells[i].count;
		}

		this.round = 0;
		this.dices = [];
		this.tmp.dices = this.setDices(this.tmp.res_by_count.length);
	},
	getCellType: function(i,j){
		if (i == 0 || i == this.height-1 || j == 0 || j == this.width-1) return obj_first(this.cells);
		return 'resources';
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
	},

	getRandomDice: function(){
		var i = random(this.tmp.dices.length-1);
		var result = this.tmp.dices[i];
		this.tmp.dices.splice(i,1);
		return result;
	},
	getNextDice: function(){
		return random_elem(this.dices);
	},
	setDices: function(res_count){
		var result = {};
		var num;

		for (var i=0; i<1000; i++){
			num = random(1,6)+random(1,6);
			if (num != 7) result[num] = (result[num] || 0) + 1;
		}

		var tmp = [];
		for (var i in result){
			tmp.push({
				digit: i,
				count: result[i]
			});
		}
		tmp = sort_obj_arr(tmp, 'count');

		var first = tmp[0].count;
		var last = arr_last(tmp).count;
		var third = (last - first)/3;

		result = [[],[],[]];

		for (var i in tmp){
			if (tmp[i].count - first < third){
				num = 0;// min probability
			}
			else{
				if (last - tmp[i].count < third){
					num = 2;// max prob
				}
				else{
					num = 1;// avg prob
				}
			}

			result[num].push(tmp[i].digit);
		}

		tmp = [];

		// average prob array
		num = parseInt(res_count/2);
		this.setDicesByProb('avg', num, result[1], tmp);

		// minimum prob array
		res_count -= num;
		num = parseInt(res_count/2);
		this.setDicesByProb('min', num, result[0], tmp);

		// maximum prob array
		res_count -= num;
		num = res_count;
		this.setDicesByProb('max', num, result[2], tmp);

		return tmp;
	},
	setDicesByProb: function(prob_name, all_count, arr, result){
		var count = parseInt(all_count/arr.length);// count of each digit
		if (count < 1) count = 1;

		var i = 0;
		var digit;

		for (var index=0; i<all_count; index++){
			for (var j=0; i<all_count && j<count; j++){
				digit = arr[index] || arr_last(arr);

				if (j == 0) this.dices.push(digit);

				result.push({
					digit: digit,
					prob: prob_name
				});
				i++;
			}
		}
	}
};
