Views.Map = function(o){
	this.Init(o);
	this.Create();
};
Views.Map.prototype = {
	Init: function(o){
		$.extend(this,o);

		var show_hover = this.hover;
		this.hover = {};
		var type;

		for (var i in this.object_types){
			type = this.object_types[i];

			this.hover[type] = new this.Hover({
				parent: this,
				type: type
			});
		}

		if (show_hover) this.CreateHovers(show_hover);
	},
	Create: function(){
		var content = '';
		var coo;

		for (var i=0; i<this.height; i++){
			var row = '';

			for (var j=0; j<this.width; j++)
			{
				coo = this.getCooStr(i,j);
				row += this.html.td({'class': 'cell', 'data-type': this.data[coo].type, 'data-coo': coo});
			}
			content += this.html.tr(row);
		}

		this.DOM.html(this.html.table(content));
	},
	CreateHovers: function(type){
		this.hover[type].Create(this.resources);
	},
	ToggleHover: function(type, show){
		type = type || false;

		if (is_bool(type)){
			for (var t in this.hover){
				this.hover[t].Toggle(type);
			}
			return;
		}

		this.hover[type].Toggle(show);
	},
	setObject: function(elem){
		elem = $(elem);
		elem.addClass('added');
		this.setHover({
			added: true,
			element: elem,
			type: this.parent.getType(elem),
			coo: this.getCoo(elem, true),
			direction: this.getDir(elem)
		});
	},
	ObjectIsSet: function(elem){
		return $(elem).is('.added');
	},
	isObjectType: function(type){
		return in_array(type, this.object_types);
	},

	// Coordinates
	getCoo: function(elem, as_str){
		var coo = $(elem).data('coo');
		return as_str ? coo : this.getCooArray(coo);
	},
	getCooArray: function(str){
		str = str.split('-');
		return [+str[0],+str[1]];
	},
	getCooStr: function(i,j){
		return is_array(i) ? i.join('-') : i+(j === undefined ? '' : '-'+j);
	},

	getType: function(){
		return this.parent.getType(this.DOM);
	},
	setType: function(type){
		this.parent.setType(this.DOM, type);
	},
	removeType: function(){
		this.parent.removeType(this.DOM);
	},

	getDir: function(elem){
		return elem.data('dir');
	},

	getCell: function(i,j){
		return is_array(i) ? this.getCell(i[0],i[1]) : this.data[this.getCooStr(i,j)];
	},
	getHover: function(o, coo, dir){
		if (!is_object(o)){
			o = {
				type: o,
				coo: coo,
				direction: dir
			};
		}
		return this.hover[o.type].get(o);
	},
	setHover: function(o, elem, coo, dir){
		if (!is_object(o)){
			o = {
				type: o,
				element: elem,
				coo: coo,
				direction: dir
			};
		}
		this.hover[o.type].set(o);
	},

	CreateNearest(type){
		this.parent.disable(this.getHover(type));
		var nearest = this.getNearest(type);

		for (var i in nearest){
			this.parent.enable(nearest[i]);
		}
	},

	getAddedObjects: function(type){
		return this.getHover({type: type, added: true});
	},
	getNearest: function(type){
		switch (type){
			case 'road':
				return this.getNearestLines(type);
			case 'village':
			case 'town':
				return this.getNearestCorners(type);
			default:
				return [];
		}
	},
	getNearestCorners: function(type){
		var result = [];
		var objects = this.getAddedObjects(type);
		var elem, coo, direction, cell_pos, corner_dir;

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
					this.setElemByType(this.getCell(cell_pos), type, tmp, cell_pos);
					elem = this.getHover(type, coo[i], tmp);
				}

				elem.each(function(){
					if (!$(this).is('.added')) result.push($(this));
				});
			}
		}

		return result;
	},
	getNearestLines: function(type){
		var result = [];
		var objects = this.getAddedObjects(type);
		var elem, coo, cell_pos, line_dir;

		for (var pos in objects){
			pos = this.getCooArray(pos);
			coo = [pos, [pos[0]-1,pos[1]], [pos[0],pos[1]-1]];

			for (var i in coo){
				switch (+i){
					case 0:
						line_dir = ['top','left'];
						break;
					case 1:
						line_dir = ['left'];
						break;
					case 2:
						line_dir = ['top'];
						break;
				}

				elem = this.getHover(type, coo[i], line_dir);

				if (!elem.length){
					cell_pos = [pos[0],pos[1]];

					switch (+i){
						case 1:
							cell_pos[0]--
							break;
						case 2:
							cell_pos[1]--
							break;
					}

					this.setElemByType(this.getCell(cell_pos), type, line_dir, cell_pos);
					elem = this.getHover(type, coo[i], line_dir);
				}

				elem.each(function(){
					if (!$(this).is('.added')) result.push($(this));
				});
			}
		}

		return result;
	},

	setElemByType: function(elem, type, direction, pos){
		switch (type){
			case 'road':
				this.setLine(elem, type, direction, pos);
				break;
			case 'village':
			case 'town':
				this.setCorner(elem, type, direction, pos);
				break;
		}
	},
	setCorner: function(elem, type, direction, pos){
		if (!in_array('left',direction) && !in_array('right',direction) || !in_array('top',direction) && !in_array('bottom',direction)) return;

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
					'class': 'corner '+dir,
					'data-coo': coo,
					'data-dir': dir,
					'data-type': type
				}));
				this.setHover(type, hover_elem, coo, dir);
				elem.append(hover_elem);
			}
		}
	},
	setLine: function(elem, direction, pos){
		var type = 'line';

		for (var i in direction){
			var dir = direction[i];
			var coo = [pos[0],pos[1]];

			if (dir == 'bottom') coo[0]++;
			if (dir == 'right') coo[1]++;

			coo = this.getCooStr(coo);
			if (this.getHover(type, coo, dir)) continue;

			var hover_elem = $(this.html.div({
				'class': 'line line-'+dir,
				'data-coo': coo,
				'data-dir': dir,
				'data-type': type
			}));
			this.setHover(type, hover_elem, coo, dir);
			elem.append(hover_elem);
		}
	}
};
