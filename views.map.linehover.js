Views.Map.prototype.Hover.prototype.LineHover = function(o){
	this.Init(o);
};
Views.Map.prototype.Hover.prototype.LineHover.prototype = {
	Init: function(o){
		$.extend(this,o);

		this.cached = {};
		this.added = {};
	},
	Create: function(direction, pos, enabled){
		var cell_elem = this.parent.getCell(pos);

		for (var i in direction)
		{
			var dir = direction[i];
			var coo = [pos[0],pos[1]];

			if (dir == 'bottom') coo[0]++;
			if (dir == 'right') coo[1]++;

			if (this.get(coo, dir)) continue;

			coo = this.getCooStr(coo);
			var hover_elem = $(this.html.div({
				'class': (enabled?'':'disabled ')+'line line-'+dir,
				'data-coo': coo,
				'data-dir': dir,
				'data-type': this.type
			}));
			this.set({element: hover_elem, coo: coo, direction: dir});
			cell_elem.append(hover_elem);
		}
	},
	getNearest: function(){
		var result = [];

		var objects = this.parent.getAddedObjects('village');
		var elem, coo, cell_pos, direction, line_dir;

		for (var pos in objects){
			direction = objects[pos].data('dir');
			pos = this.parent.getCooArray(pos);
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

				if (!this.parent.getRes(cell_pos)){
					if (!this.parent.getRes(cell_pos[0],cell_pos[1]-1)) arr_remove(line_dir, 'left');
					if (!this.parent.getRes(cell_pos[0]-1,cell_pos[1])) arr_remove(line_dir, 'top');
				}

				if (!line_dir.length) continue;

				elem = this.get(coo[i], line_dir, true);// returns array

				if (!elem.length){
					this.Create(line_dir, cell_pos);
					elem = this.get(coo[i], line_dir, true);// returns array
					if (!elem || !elem.length) _Error.ThrowType('line elements coo='+this.getCooStr(coo[i])+' in cell coo='+this.getCooStr(cell_pos)+' not found');
				}

				for (var j in elem){
					if (!this.parent.ObjectIsSet(elem[j])) result.push(elem[j]);
				}
			}
		}

		return result;
	},

	get: function(o, dir, as_array){
		if (as_array)
		{
			dir = to_arr(dir);

			var result = [];
			var elem;

			for (var i in dir){
				elem = this.get(o, dir[i]);
				if (elem) result.push(elem);
			}

			return result;
		}

		if (is_array(o)) o = {
			coo: o,
			direction: dir
		};

		return this.getElem(o.added)[this.getCooStr(o)];
	},
	set: function(o){
		this.getElem(o.added)[this.getCooStr(o)] = o.element;
	},
	getElem: function(added){
		return this[added ? 'added' : 'cached'];
	},

	getCooStr: function(o){
		_Error.CheckType(o, 'object');
		if (is_array(o)) o = {coo: o};

		o.coo = this.parent.getCooStr(o.coo);
		if (o.direction) o.coo = this.parent.getCooStr(o.coo, o.direction);
		return o.coo;
	}
};
