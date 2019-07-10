window.Views = {
	Bind: function(event, name, handler){
		$(document).on(event, name, function(e){
			handler(e, this, name);
		});
	},
	setElem: function(names){
		for (var i in names){
			this[i] = $(names[i]);
		}
	},
	isDisabled: function(elem){
		return $(elem).is('.disabled');
	},
	enable: function(elem){
		$(elem).removeClass('disabled');
	},
	disable: function(elem){
		$(elem).addClass('disabled');
	},
	getType: function(elem){
		return $(elem).data('type');
	},
	getRes: function(elem){
		return $(elem).data('res');
	},

	message: function(o){
		var m = this.message_elem;

		if (m){
			m.removeClass('hidden');
			m.html(o.text);
		}
		else{
			m = $(this.html.span(o.text, {'class': 'modal-message'}));
			$('body').append(m);
			this.message_elem = m;
		}

		setTimeout(function(){m.addClass('hidden'); (o.success && o.success())}, o.ms || 1000);
	},
	enter_number: function(title){
		return prompt(title);
	},

	// Map
	map_view: function(map){
		var content = '';
		this.setMapData(map);

		for (var i=0; i<this.map.height; i++){
			var row = '';

			for (var j=0; j<this.map.width; j++)
			{
				var cell = this.map.data[i+'-'+j];
				row += this.html.td(cell && cell.name && {'class': 'cell', 'data-name': cell.name, 'data-coo': i+'-'+j} || '');
			}
			content += this.html.tr(row);
		}

		this.map_elem.html(this.html.table(content));
	},
	setMapData: function(map){
		this.map = new this.Map({
			parent: this,
			DOM: this.map_elem,
			object_types: map.getTypes(),
			data: map.data,
			resources: map.res_data,
			width: map.getWidth(),
			height: map.getHeight()
		});
	},
	CheckFilter: function(elem){
		var type = this.getType(elem);

		if (this.needFilter(elem))
			this.map.CreateNearest(type);
		else
			this.map.CreateHoverTable(type);
	},

	// Objects Description
	description: function(receipts){
		var content = '';
		var res, tmp, title, obj, type;

		for (var i in receipts){
			res = '';

			for (var j in receipts[i]){
				tmp = receipts[i][j];

				for (var k=0; k<tmp.count; k++){
					res += this.html.div({'class': 'pull-left', 'data-name': tmp.name});
				}
				title = tmp.title;
				obj = tmp.object;
				type = tmp.type;
			}
			content += this.html.div(res+this.html.div(title, {'class': 'pull-right'}), {'data-type': type, 'data-res': obj, 'class': 'disabled'});
		}

		this.descr_elem.html(content);
		this.descr_elements = this.descr_elem.find('[data-res]');
	},
	getDescrElem: function(o){
		if (o){
			if (is_object(o)) o = obj_keys(o).join('"], [data-res="');
			return this.descr_elem.find('[data-res="'+o+'"]');
		}

		return this.descr_elements;
	},
	enableObject: function(o){
		this.getDescrElem(o).removeClass('disabled');
	},
	disableObject: function(o){
		this.getDescrElem(o).addClass('disabled');
	},

	toggleTurnButton: function(show){
		this.step_over_button.prop('disabled', show);
	},

	setObject: function(elem){
		elem = $(elem);
		elem.addClass('added');
		this.added_elem[this.getType(elem)][this.map.getCoo(elem, true)] = elem;
	},
	ObjectIsSet: function(elem){
		return $(elem).is('.added');
	},

	needFilter: function(elem){
		return $(elem).is('.filtered');
	},
	setFilter: function(elem){
		$(elem).addClass('filtered');
	},
	removeFilter: function(elem){
		$(elem).removeClass('filtered');
	}
};
