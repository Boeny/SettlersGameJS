Views.Map = function(o){
	$.extend(this,o);

	this.hover_elem = this.initCachedElem();
	this.added_elem = this.initCachedElem();
};
Views.Map.prototype = {
	initCachedElem: function(){
		var obj = {};

		for (var i in object_types){
			obj[object_types[i]] = {};
		}

		return obj;
	},
	isObjectType: function(type){
		return in_array(type, this.object_types);
	},

	// Coordinates
	getCoo: function(elem, as_str){
		var coo = $(elem).data('coo');
		return as_str ? coo : this.getCooArray(coo);
	},
	getCooArray: function(s){
		s = s.split('-');
		return [+s[0],+s[1]];
	},
	getCooStr: function(i,j){
		return is_array(i) ? i.join('-') : i+'-'+j;
	},

	getElem: function(i,j, cls){
		if (i === null){
			return this.DOM.find(j);
		}

		if (is_array(i)){
			cls = j;
			j = i[1];
			i = i[0];
		}

		var coo = this.map.getCooStr(i,j);
		var type = cls && in_str('.',cls) && cls.split('.')[1];
		var cached = this.map.isObjectType(type) && this.hover_elem[type][coo];

		return cached ? cached : this.DOM.find((cls || '')+'[data-coo="'+coo+'"]');
	},

	// Hover Elements
	hover: {
		Create: function(type){
			var length = obj_length(this.hover_elem[type]);
			if (length > 0 && $('.'+type).length == length) return;

			var res = this.resources;

			for (var coo in res){
				coo = this.map.getCooArray(coo);

				var elem = this.getElem(coo, '.cell');
				var dir = {top:1,bottom:1,left:1,right:1};

				if (coo[0] == 0) delete dir.top;
				if (coo[1] == 0) delete dir.left;
				if (coo[0] == this.map.height-1 || res[ this.map.getCooStr(coo[0]-1,coo[1]) ]) delete dir.bottom;
				if (coo[1] == this.map.width-1 || res[ this.map.getCooStr(coo[0],coo[1]-1) ]) delete dir.right;

				this.setElemByType(elem, type, obj_keys(dir), coo);
			}
		},
		Change: function(cls){
			this.DOM.removeClass().addClass('map'+(cls ? ' '+cls : ''));
		},
		Hide: function(){
			this.change_hover_table();
		},
		Show: function(elem){
			var enabled = !this.isDisabled(elem);
			if (enabled){
				this.change_hover_table(this.getType(elem)+'-hover');
			}
			return enabled;
		},
		Toggle: function(elem, show){
			return this[(show ? 'show' : 'hide')+'_hover_table'](elem);
		}
	},

	CreateNearest(type){
		this.disable(this.getElem(null, '.added.'+type));
		var nearest = this.getNearest(type);

		for (var i in nearest){
			this.enable(nearest[i]);
		}
	},

	getAddedObjects: function(type){
		return this.added_elem[type];
	},
	getNearest: function(type){
		switch (type){
			case 'line':
				return this.getNearestLines();
			case 'corner':
				return this.getNearestCorners();
			default:
				return [];
		}
	},
	getNearestCorners: function(){
		var result = [];
		var objects = this.getAddedObjects('line');
		var elem, coo, direction, cell_pos, corner_dir;

		for (var pos in objects){
			direction = objects[pos].data('dir');
			pos = this.map.getCooArray(pos);
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
				elem = this.getElem(coo[i], '.corner');

				if (!elem.length){
					this.setCorner(this.getElem(cell_pos, '.cell'), i == 0 ? ['top','left'] : corner_dir, cell_pos);
					elem = this.getElem(coo[i], '.corner');
				}

				elem.each(function(){
					if (!$(this).is('.added')) result.push($(this));
				});
			}
		}

		return result;
	},
	getNearestLines: function(){
		var result = [];
		var objects = this.getAddedObjects('corner');
		var elem, coo, cell_pos, line_dir;

		for (var pos in objects){
			pos = this.map.getCooArray(pos);
			coo = [pos, [pos[0]-1,pos[1]], [pos[0],pos[1]-1]];

			for (var i in coo){
				elem = this.getElem(coo[i], '.line');

				if (!elem.length){
					cell_pos = [pos[0],pos[1]];

					switch (+i){
						case 0:
							line_dir = ['top','left'];
							break;
						case 1:
							line_dir = ['left'];
							cell_pos[0]--
							break;
						case 2:
							line_dir = ['top'];
							cell_pos[1]--
							break;
					}

					this.setLine(this.getElem(cell_pos, '.cell'), line_dir, cell_pos);
					elem = this.getElem(coo[i], '.line');
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
			case 'line':
				this.setLine(elem, direction, pos);
				break;
			case 'corner':
				this.setCorner(elem, direction, pos);
				break;
		}
	},
	setCorner: function(elem, direction, pos){
		if (!in_array('left',direction) && !in_array('right',direction) || !in_array('top',direction) && !in_array('bottom',direction)) return;

		var type = 'corner';
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
				dir = this.map.getCooStr(vert[i], hor[j]);
				var coo = [pos[0],pos[1]];

				if (vert[i] == 'bottom') coo[0]++;
				if (hor[j] == 'right') coo[1]++;

				coo = this.map.getCooStr(coo);
				if (elem.find('.'+type+'[data-coo="'+coo+'"][data-dir="'+dir+'"]').length) continue;

				var hover_elem = $(this.html.div({
					'class': type+' '+dir,
					'data-coo': coo,
					'data-dir': dir,
					'data-type': type
				}));
				this.hover_elem[type][coo] = hover_elem;
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

			coo = this.map.getCooStr(coo);
			if (elem.find('.'+type+'[data-coo="'+coo+'"][data-dir="'+dir+'"]').length) continue;

			var hover_elem = $(this.html.div({
				'class': type+' '+type+'-'+dir,
				'data-coo': coo,
				'data-dir': dir,
				'data-type': type
			}));
			this.hover_elem[type][coo] = hover_elem;
			elem.append(hover_elem);
		}
	}
};
