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
		_Error.ThrowTypeIf(!cells_info || !obj_length(cells_info), 'need resources');
		if (this.filled) return;

		for (var coo in cells_info){
			coo = this.parent.getCooArray(coo);
			var dir = {top:1,bottom:1,left:1,right:1};

			if (coo[0] == 0) delete dir.top;
			if (coo[1] == 0) delete dir.left;
			if (coo[0] == this.parent.height-1 || this.parent.getRes(coo[0]+1, coo[1])) delete dir.bottom;
			if (coo[1] == this.parent.width-1 || this.parent.getRes(coo[0], coo[1]+1)) delete dir.right;

			this.parent.setElemByType(this.type, obj_keys(dir), coo, true);// enabled
		}

		this.filled = true;
	},

	get: function(o){
		if (!o) return this.cached;

		var elements = this.getElem(o.added);
		return o.i === undefined && !o.coo ? elements : elements[this.getCooStr(o)];
	},
	set: function(o){
		_Error.CheckType(o, 'object', true);// strict
		this.getElem(o.added, true)[this.getCooStr(o)] = o.element;
	},
	getElem: function(added, check){
		var type = added ? 'added' : 'cached';
		var elements = this[type];
		if (check) _Error.ThrowTypeIf(!elements, type+' elements are empty', 'views.hover.getElem');

		return elements;
	},

	getCooStr: function(o){
		_Error.CheckType(o, 'object', true);
		o.i = o.coo ? o.coo : o.i;

		o.coo = this.parent.getCooStr(o.i, o.j);
		o.direction = this.parent.getCooStr(o.direction);
		return this.parent.getCooStr(o.coo, o.direction);
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
