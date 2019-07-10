Views.Map.prototype.Hover = function(o){
	this.Init(o);
};
Views.Map.prototype.Hover.prototype = {
	Init: function(o){
		$.extend(this,o);

		this.cached = {};
		this.added = {};
		this.filled = false;
	},
	Create: function(cells_info){
		if (this.filled) return;

		for (var coo in cells_info){
			coo = this.getCooArray(coo);

			var elem = this.parent.getCell(coo);
			var dir = {top:1,bottom:1,left:1,right:1};

			if (coo[0] == 0) delete dir.top;
			if (coo[1] == 0) delete dir.left;
			if (coo[0] == this.parent.height-1 || cells_info[ this.parent.getCooStr(coo[0]-1,coo[1]) ]) delete dir.bottom;
			if (coo[1] == this.parent.width-1 || cells_info[ this.parent.getCooStr(coo[0],coo[1]-1) ]) delete dir.right;

			this.parent.setElemByType(elem, this.type, obj_keys(dir), coo);
		}

		this.filled = true;
	},

	get: function(o){
		if (!o) return this.cached;
		var elements = this[o.added ? 'added' : 'cached'];
		return o.i === undefined && !o.coo ? elements : elements[this.getCooStr(o)];
	},
	set: function(o){
		this.elements[this.getCooStr(o)] = o.element;
	},

	getCooArray: function(str){
		return this.parent.getCooArray(str);
	},
	getCooStr: function(i,j,dir){
		if (is_object(i)){
			i = i.coo ? i.coo : i.i;
			dir = dir ? dir : i.direction
		}
		var coo = this.parent.getCooStr(i,j);
		dir = this.parent.getCooStr(dir);
		return this.parent.getCooStr(coo, dir);
	},

	Hide: function(){
		this.parent.removeType();
	},
	Show: function(){
		this.parent.setType(this.type);
	},
	Toggle: function(show){
		return this[(show ? 'Show' : 'Hide')]();
	}
};
