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
				type: type,
				html: this.html
			});
		}
		
		if (show_hover) this.CreateHovers(show_hover);
	},
	
	getDice: function(i,j){
		return this.dices[this.getCooStr(i,j)];
	},
	showDice: function(digit){
		var dice = this.DOM.find('.num[data-digit="'+digit+'"]');
		_Error.ThrowTypeIf(!dice.length, 'dice='+digit+' has not found');
		dice.addClass('big');
		setTimeout(function(){dice.removeClass('big')}, 400);
	},
	
	Create: function(){
		var content = '';
		var coo, num, dice;
		
		for (var i=0; i<this.height; i++){
			var row = '';
			
			for (var j=0; j<this.width; j++)
			{
				coo = this.getCooStr(i,j);
				dice = this.getDice(i,j);
				num = this.getRes(i,j) ? this.html.div(dice.digit, {'class': 'num '+dice.prob, 'data-digit': dice.digit}) : '';
				row += this.html.td(num, {'class': 'cell', 'data-type': this.data[coo].type, 'data-coo': coo});
			}
			content += this.html.tr(row);
		}
		
		this.DOM.html(this.html.table(content));
	},
	CreateHovers: function(type){
		this.hover[type].CreateAll(this.getRes());
	},
	ToggleHover: function(type, show){
		type = type || false;
		
		if (is_bool(type)){
			for (var t in this.hover){
				this.hover[t].Toggle(type);
			}
			return;
		}
		
		if (is_array(type)){
			for (var i in type){
				this.hover[type[i]].Toggle(true);
			}
			return;
		}
		
		if (is_object(type)){
			for (var t in type){
				this.hover[t].Toggle(type[t]);
			}
			return;
		}
		
		this.hover[type].Toggle(show);
	},
	setObject: function(elem){
		elem = $(elem);
		var coo = this.getCoo(elem, true);
		
		this.setHover({
			added: true,
			element: elem,
			type: this.parent.getType(elem),
			coo: coo,
			direction: this.getDir(elem)
		});
		
		return coo;
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
		if (i === undefined && j === undefined) return this.DOM.find('.cell');
		var cell = is_array(i) ? this.getCell(i[0],i[1]) : this.DOM.find('.cell[data-coo="'+this.getCooStr(i,j)+'"]');
		if (!cell.length) _Error.ThrowType('cell not found, coo = '+this.getCooStr(i,j), 'views.map.getCell');
		return cell;
	},
	getRes: function(i,j){
		if (i === undefined && j === undefined) return this.resources;
		return is_array(i) ? this.getRes(i[0],i[1]) : this.resources[this.getCooStr(i,j)];
	},
	getHover: function(o, coo, dir){
		var type = is_object(o) ? o.type : o;
		
		if (!is_object(o)){
			o = {
				coo: coo,
				direction: dir
			};
		}
		else
			delete o.type;
		
		_Error.ThrowTypeIf(!type, 'type are empty', 'views.map.getHover');
		return this.hover[type].get(o);
	},
	setHover: function(o){
		this.hover[o.type].set(o);
	},
	
	CreateNearest(type){
		var nearest = this.getHover(type);
		
		for (var i in nearest){
			this.parent.disable(nearest[i]);
		}
		
		nearest = this.getNearest(type);
		if (!nearest.length) return;
		
		for (var i in nearest){
			this.parent.enable(nearest[i]);
		}
	},
	
	getNearest: function(type){
		return this.hover[type].getNearest();
	},
};