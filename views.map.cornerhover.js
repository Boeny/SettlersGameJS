Views.Map.prototype.Hover.prototype.CornerHover = function(o){
	this.Init(o);
};
Views.Map.prototype.Hover.prototype.CornerHover.prototype = {
	Init: function(o){
		$.extend(this,o);

		this.filled = false;
		this.cached = {};
		this.added = {};
	},
	Create: function(direction, pos, enabled){
		if (!in_array('left',direction) && !in_array('right',direction) || !in_array('top',direction) && !in_array('bottom',direction)) return;

		var cell_elem = this.parent.getCell(pos);
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
				var coo = [pos[0],pos[1]];

				if (vert[i] == 'bottom') coo[0]++;
				if (hor[j] == 'right') coo[1]++;

				coo = this.getCooStr(coo);
				if (this.get(coo)) continue;

				dir = this.getCooStr(vert[i], hor[j]);
				var hover_elem = $(this.html.div({
					'class': (enabled?'':'disabled ')+'corner '+dir,
					'data-coo': coo,
					'data-dir': dir,
					'data-type': this.type
				}));
				this.set({element: hover_elem, coo: coo});
				cell_elem.append(hover_elem);
			}
		}
	},
	getNearest: function(){
		var result = [];
		var objects = this.parent.getAddedObjects('road');
		var elem, coo, cell_pos, direction, corner_dir;

		for (var pos in objects){
			direction = objects[pos].data('dir');
			pos = this.parent.getCooArray(pos);
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
				elem = this.get(coo[i]);

				if (!elem){
					this.Create(i == 0 ? ['top','left'] : corner_dir, cell_pos);
					elem = this.get(coo[i]);
					if (!elem) _Error.ThrowType('corner element coo='+this.getCooStr(coo[i])+' in cell coo='+this.getCooStr(cell_pos)+' not found');
				}

				if (!this.parent.ObjectIsSet(elem)) result.push(elem);
			}
		}

		return result;
	},

	get: function(o){
		if (is_array(o)) o = {coo: o};
		return this.getElem(o.added)[this.getCooStr(o.coo)];
	},
	set: function(o){
		this.getElem(o.added)[this.getCooStr(o.coo)] = o.element;
	},
	getElem: function(added){
		return this[added ? 'added' : 'cached'];
	},

	getCooStr: function(i,j){
		return this.parent.getCooStr(i,j);
	}
};
