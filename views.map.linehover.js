Views.Map.prototype.Hover.prototype.LineHover = function(o){
	this.Init(o);
};
Views.Map.prototype.Hover.prototype.LineHover.prototype = {
	Init: function(o){
		$.extend(this,o);

		this.cached = {};
		this.added = {};
	},
	Create: function(type, direction, pos, enabled){
		var cell_elem = this.getCell(pos);

		for (var i in direction)
		{
			var dir = direction[i];
			var coo = [pos[0],pos[1]];

			if (dir == 'bottom') coo[0]++;
			if (dir == 'right') coo[1]++;

			coo = this.getCooStr(coo);
			if (this.getHover(type, coo, dir)) continue;

			var hover_elem = $(this.html.div({
				'class': (enabled?'':'disabled ')+'line line-'+dir,
				'data-coo': coo,
				'data-dir': dir,
				'data-type': type
			}));
			this.setHover(type, hover_elem, coo, dir);
			cell_elem.append(hover_elem);
		}
	},
	getNearest: function(){
		var result = [];
		var objects = this.getAddedObjects('village');
		var elem, coo, cell_pos, direction, line_dir;

		for (var pos in objects){
			direction = objects[pos].data('dir');
			pos = this.getCooArray(pos);
			coo = [pos, [pos[0]-1,pos[1]], [pos[0],pos[1]-1]];

			for (var i in coo){
				cell_pos = [pos[0],pos[1]];

				switch (+i){
					case 0:
						line_dir = ['top','left'];
						break;
					case 1:
						cell_pos[0]--;
						line_dir = ['left'];
						break;
					case 2:
						cell_pos[1]--
						line_dir = ['top'];
						break;
				}

				if (!this.getRes(cell_pos)){
					if (!this.getRes(cell_pos[0],cell_pos[1]-1)) arr_remove(line_dir, 'left');
					if (!this.getRes(cell_pos[0]-1,cell_pos[1])) arr_remove(line_dir, 'top');
				}

				if (!line_dir.length) continue;

				elem = this.getHover(type, coo[i], line_dir, true);// returns array

				if (!elem.length){
					this.setElemByType(type, line_dir, cell_pos);
					elem = this.getHover(type, coo[i], line_dir, true);// returns array
					if (!elem || !elem.length) _Error.ThrowType('line elements coo='+this.getCooStr(coo[i])+' in cell coo='+this.getCooStr(cell_pos)+' not found');
				}

				_Error.ThrowTypeIf(!is_array(elem), 'line element must be array, coo='+this.getCooStr(coo[i])+' in cell coo='+this.getCooStr(cell_pos));

				for (var j in elem){
					if (!this.ObjectIsSet(elem[j])) result.push(elem[j]);
				}
			}
		}

		return result;
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
	}
};
