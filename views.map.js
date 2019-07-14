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
		this.hover[type].Create(this.getRes());
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
	/**
	 * returns DOM
	 */
	getCell: function(i,j){
		if (i === undefined && j === undefined) return this.DOM.find('.cell');
		var cell = is_array(i) ? this.getCell(i[0],i[1]) : this.DOM.find('.cell[data-coo="'+this.getCooStr(i,j)+'"]');
		if (!cell.length) _Error.ThrowType('cell not found, coo = '+this.getCooStr(i,j), 'views.map.getCell');
		return cell;
	},
	getRes: function(i,j){
		if (i === undefined && j === undefined) return this.resources;
		return is_array(i) ? this.getRes(i[0],i[1]) : this.resources[this.getCooStr(i,j)];
	},
	getHover: function(o, coo, dir, as_array){
		if (as_array)
		{
			dir = to_arr(dir);

			var result = [];
			var elem;

			for (var i in dir){
				elem = this.getHover(o, coo, dir[i]);
				if (elem) result.push(elem);
			}

			return result;
		}

		if (!is_object(o)){
			o = {
				type: o,
				coo: coo,
				direction: dir
			};
		}
		_Error.ThrowTypeIf(!o.type, 'type are empty', 'views.map.getHover');
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
		_Error.ThrowTypeIf(!o.type || !o.element || !o.coo || !o.direction, 'some params are empty', 'views.map.setHover');
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
	}
};
