window.Map = function(o){

};
Map.prototype = {
	getWidth: function(){
		return this.rules.width;
	},
	getHeight: function(){
		return this.rules.height;
	},
	getLastIndex: function(){
		return {hor: this.getWidth()-1, vert: this.getHeight()-1};
	},
	getData: function(i,j){
		return i === undefined ? this.data : (this.data[i || 0] ? this.data[i || 0][j || 0] : null);
	},
	Generate: function(rules){
		this.rules = rules;
		this.data = [];

		for (var i=0; i<this.getHeight(); i++){
			var row = [];

			for (var j=0; j<this.getWidth(); j++){
				row.push(this.rules.getRandomRes(i,j));
			}
			this.data.push(row);
		}
		return this.data;
	},

	isRes: function(i,j){
		if (!is_object(i)) i = this.getData(i,j);
		if (!i) return false;
		return in_array(i.name, obj_keys(this.rules.resources));
	},
	getCorners: function(i,j){
		if (!this.isRes(i,j)) return {};

		var types = {top:1,left:1,bottom:1,right:1};
		var last = this.getLastIndex();

		if (i == 0 || this.isRes(i-1,j)) delete types.top;
		if (i == last.vert) delete types.bottom;
		if (j == 0 || this.isRes(i,j-1)) delete types.left;
		if (j == last.hor) delete types.right;

		if (!types.left && !types.right || !types.top && !types.bottom) return {};

		types.resources = this.getResourcesAround(i,j, types);
		return types;
	},
	getResourcesAround: function(i,j, corners){
		var result = {};
		var types = {vert: ['top','bottom'], hor: ['left','right']};
		var type = {vert: '', hor: ''};
		var cell, coo;

		for (var vert=0; vert<2; vert++)
		{
			type.vert = types.vert[vert];
			if (!corners[type.vert]) continue;

			for (var hor=0; hor<2; hor++)
			{
				type.hor = types.hor[hor];
				if (!corners[type.hor]) continue;

				coo = [[0,0],[0,0],[0,0],[0,0]];

				switch (type.vert){
					case 'top':
						coo[0][0] = -1;
						coo[1][0] = -1;
						break;
					case 'bottom':
						coo[2][0] = 1;
						coo[3][0] = 1;
						break;
				}
				switch (type.hor){
					case 'left':
						coo[0][1] = -1;
						coo[2][1] = -1;
						break;
					case 'right':
						coo[1][1] = 1;
						coo[3][1] = 1;
						break;
				}

				if (!result[type.vert]) result[type.vert] = {};
				if (!result[type.vert][type.hor]) result[type.vert][type.hor] = [];

				for (var k=0; k<4; k++){
					cell = this.getData(i + coo[k][0], j + coo[k][1]);

					if (cell && this.isRes(cell)){
						result[type.vert][type.hor].push(cell.name);
					}
				}
			}
		}
		return result;
	},
	getLines: function(i,j){
		if (!this.isRes(i,j)) return {};

		var types = {top:1,left:1,bottom:1,right:1};
		var last = this.getLastIndex();

		if (i == 0 || this.isRes(i-1,j)) delete types.top;
		if (i == last.vert) delete types.bottom;
		if (j == 0 || this.isRes(i,j-1)) delete types.left;
		if (j == last.hor) delete types.right;

		return types;
	}
};
