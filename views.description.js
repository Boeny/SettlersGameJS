Views.Description = function(o){
	this.Init(o);
	this.Create(o);
};
Views.Description.prototype = {
	Init: function(o){
		$.extend(this,o);
		this.cached = {};
	},
	Create: function(o){
		var obj, res;

		for (var i in o.types){
			var object = '';
			obj = o.types[i];

			for (var j in obj.resources){
				res = obj.resources[j];

				for (var k=0; k<res.count; k++){
					object += this.html.div(res.type, {'class': 'resource pull-left', 'data-type': res.type});
				}
			}

			this.cached[obj.type] = $(this.html.div({
				'data-type': obj.type,
				'class': 'receipt disabled',
				content: object + this.html.div(obj.title, {'class': 'pull-right'}),
			}));

			this.DOM.append(this.cached[obj.type]);
		}
	},

	getElem: function(o){
		_Error.ThrowTypeIf(!obj_length(this.cached), 'description cache is empty', 'views.description.getElem');
		if (!o) return this.cached;

		if (is_('object', o)){
			o = is_array(o) ? o : obj_keys(o);
		}
		else
			return this.cached[o];

		var result = [];

		for (var i in o){
			result.push(this.cached[o[i]]);
		}

		return result;
	},

	Toggle: function(types){
		var elem;

		for (var type in this.getElem()){
			elem = this.getElem(type);
			this.parent.toggle(elem, in_array(type, types));
		}
	},
	Filter: function(types){
		var elem;

		for (var type in this.getElem()){
			elem = this.getElem(type);
			this.parent.toggleFilter(elem, in_array(type, types));
		}
	}
};
