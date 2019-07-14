Views.Map.prototype.Hover.prototype.CornerHover = function(o){
	this.Init(o);
};
Views.Map.prototype.Hover.prototype.CornerHover.prototype = {
	Init: function(o){
		$.extend(this,o);

		this.cached = {};
		this.added = {};
	},
	Create: function(type, direction, pos, enabled){
		if (!in_array('left',direction) && !in_array('right',direction) || !in_array('top',direction) && !in_array('bottom',direction)) return;

		var cell_elem = this.getCell(pos);
		var vert = [], hor = [], dir;

		for (var i in direction){
			dir = direction[i];

			if (dir == 'top' || dir == 'bottom')
				vert.push(dir)
			else
				hor.push(dir);
		}

		for (var i in vert){
			for (var j in hor){
				dir = this.getCooStr(vert[i], hor[j]);
				var coo = [pos[0],pos[1]];

				if (vert[i] == 'bottom') coo[0]++;
				if (hor[j] == 'right') coo[1]++;

				coo = this.getCooStr(coo);
				if (this.getHover(type, coo, dir)) continue;

				var hover_elem = $(this.html.div({
					'class': (enabled?'':'disabled ')+'corner '+dir,
					'data-coo': coo,
					'data-dir': dir,
					'data-type': type
				}));
				this.setHover(type, hover_elem, coo, dir);
				cell_elem.append(hover_elem);
			}
		}
	},
	getNearest: function(){
		var result = [];
		var objects = this.getAddedObjects('road');
		var elem, coo, cell_pos, direction, corner_dir;

		for (var pos in objects){
			direction = objects[pos].data('dir');
			pos = this.getCooArray(pos);
			coo = [pos];
			cell_pos = [pos[0],pos[1]];
			corner_dir = ['top','left'];

			switch (direction){
				case 'top':
				case 'bottom':
					coo.push([pos[0],pos[1]+1]);
					if (direction == 'bottom') cell_pos[0]--;
					corner_dir[0] = direction;
					break;

				case 'left':
				case 'right':
					coo.push([pos[0]+1,pos[1]]);
					if (direction == 'right') cell_pos[1]--;
					corner_dir[1] = direction;
					break;
			}

			for (var i in coo){
				var tmp = i == 0 ? ['top','left'] : corner_dir;
				elem = this.getHover(type, coo[i], tmp);

				if (!elem){
					this.setElemByType(type, tmp, cell_pos);
					elem = this.getHover(type, coo[i], tmp);
					if (!elem) _Error.ThrowType('corner element coo='+this.getCooStr(coo[i])+' in cell coo='+this.getCooStr(cell_pos)+' not found');
				}

				if (is_array(elem)) _Error.ThrowType('corner element has not to be array, coo='+this.getCooStr(coo[i])+' in cell coo='+this.getCooStr(cell_pos));
				if (!this.ObjectIsSet(elem)) result.push(elem);
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
		return this.parent.getCooStr(o.i, o.j);
	}
};
