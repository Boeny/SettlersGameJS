window.Rules = function(){

};
Rules.prototype = {
	width: 10,
	height: 10,
	cell: {width: 10, height: 10},

	resources: {
		stone: {count: 3, color: '#eee'},
		wood: {count: 4, color: '#f44'},
		sheep: {count: 4, color: '#2f2'},
		wheat: {count: 4, color: '#2ff'},
		clay: {count: 4, color: '#f5f5f5'},
	},
	cells: {
		//market: {color: '#b45', freq: 'resources'},
		//resources: {color: 'color', freq: 'count'},
		sea: {color: '#22f', freq:{0: [1,'width-1'], height: [1,'width-1'], '*': '+-1'}}
	},
	receipts: {
		road: [{'stone':1},{'clay':1}],
		village: [{'road':'from_exist'},{wheat:1},{wood:1},{sheep:1},{clay:1}],
		//town: [{village:'self'},{stone:3},{wheat:2}]
	},
	bonuses: {
		village: {resources: 1},
		town: {resources: 2},
		//market: {exchange: [2,3]},
	},
	market: {
		resources: 1
	},

	getRandomRes: function(){
		var res = obj_keys(this.resources);// all keys
		res = res[random(res.length-1)];// random key

        while (this.resources[res] && !parseInt(this.resources[res].count, 10)){
			delete this.resources[res];
			res = obj_keys(this.resources);

			if (!res.length){
				res = null;
				break;
			}

			res = res[random(res.length-1)];
		}

		if (!res){
			res = obj_keys(this.cells);
			res = res[random(res.length-1)];
            if (this.cells[res] && this.cells[res].count) this.cells[res].count--;
			return this.cells[res];
		}

		this.resources[res].count--;
		return this.resources[res];
	}
};
