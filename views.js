window.Views = {
	Bind: function(_e, elem, handler){
		if (is_callable(elem)){
			$(document).on(_e, function(e){
				return elem(e, $(this));
			});
			return;
		}

		$(document).on(_e, elem, function(e){
			return handler(e, $(this));
		});
	},
	Trigger: function(event_name, elem){
		$(elem || document).trigger(event_name);
	},
	setElements: function(names){
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
	toggle: function(elem, show){
		this[show ? 'enable' : 'disable'](elem);
	},

	getType: function(elem){
		return $(elem).attr('data-type');
	},
	setType: function(elem, type){
		$(elem).attr('data-type', type);
	},
	removeType: function(elem){
		$(elem).removeAttr('data-type');
	},

	toggleModalMessage: function(elem, show){
		this[(show ? 'show' : 'hide')+'ModalMessage'](elem);
	},
	showModalMessage: function(elem){
		$(elem).removeClass('hidden');
	},
	hideModalMessage: function(elem){
		$(elem).addClass('hidden');
	},
	message: function(o){
		var elem = this.message_elem;

		if (elem){
			elem.html(o.text);
			this.showModalMessage(elem);
		}
		else{
			elem = $(this.html.span(o.text, {'class': 'modal-message msg'}));
			this.main_elem.append(elem);
			this.message_elem = elem;
		}

		var $this = this;
		setTimeout(function(){$this.hideModalMessage(elem); (o.success && o.success())}, o.ms || 1000);
	},
	enter_number: function(o){
		var elem = this.prompt_elem;

		if (elem){
			elem.attr('data-target', o.target);
			elem.data('action', o.action);
			elem.find('.title').html(o.title);
			this.toggleModalMessage(elem.find('.cancel'), o.cancel);
			this.showModalMessage(elem);
		}
		else{
			elem = $(this.html.div({
				'class': 'modal-message prompt'+(o.cls ? ' '+o.cls : ''),
				'data-target': o.target,
				'data-action': o.action,

				content: this.html.div({'class': 'overlay'})+
					this.html.div(
						this.html.div(o.title, {'class': 'title'})+
						this.html.form(
							this.html.div(this.html.input({required: 'required'}))+
							this.html.div(this.html.button('OK', {type: 'submit', 'class': 'btn'})+this.html.span('Отмена', {'class': 'btn cancel'+(o.cancel ? '' : ' hidden')}))
						),
						{'class': 'container'}
					)
			}));

			this.main_elem.append(elem);
			this.prompt_elem = elem;
		}
	},

	// Game
	main: function(o){
		this.main_elem.html(
			this.html.div({
				'class': 'header',

				content: this.html.button('Новая игра', {'class': 'start_btn btn'})+
					this.html.button('Завершить ход', {'class': 'step_btn btn disabled'})
			})+
			this.html.div({
				'class': 'game_field',

				content: this.html.span({
						'class': 'map_container',
						content: this.html.span({'class': 'map'})
					})+
					this.html.span({'class': 'actual'})
			})+
			this.html.div({
				'class': 'bottom',

				content: this.html.div({'class': 'description'})
			})
		);

		this.prompt_elem = null;
		this.enter_number({cls: 'hidden'});

		this.setElements({
			header_elem: '.header',
			map_elem: '.map',
			descr_elem: '.description'
		});

		this.new_game(o);
	},
	new_game: function(o){
		this.setMapData(o.map);
		this.description_view(o.description);
		this.next_step(o);
	},
	next_step: function(o){
		this.map.ToggleHover(o.map.hover);

		o.header = o.header || {};
		for (var name in o.header){
			this.toggle($('.'+name+'_btn'), o.header[name]);
		}

		//if (!o.is_human) this.disable(this.getDescrElem());

		var $this = this;
		o.message.success = function(){
			if (!o.is_human){
				$this.Trigger('next_step');
			}
		};
		this.message(o.message);
	},

	// Map
	setMapData: function(params){
		params.parent = this;
		params.DOM = this.map_elem;
		params.html = this.html;
		this.map = new this.Map(params);
	},
	CheckFilter: function(elem){
		var type = this.getType(elem);

		if (this.needFilter(elem))
			this.map.CreateNearest(type);
		else
			this.map.CreateHoverTable(type);
	},

	// Objects Description
	description_view: function(o){
		var content = '';
		var row, obj, res;
		var list = o.list;

		for (var i in o.types){
			row = '';
			obj = o.types[i];

			for (var j in obj.resources){
				res = obj.resources[j];

				for (var k=0; k<res.count; k++){
					row += this.html.div({'class': 'resource pull-left', 'data-type': res.type});
				}
			}

			var classes = ['receipt'];
			if (in_array(obj.type, o.enabled)) classes.push('disabled');
			if (in_array(obj.type, o.filtered)) classes.push('filtered');

			content += this.html.div(row + this.html.div(obj.title, {'class': 'pull-right'}), {'data-type': obj.type, 'class': classes.join(' ')});
		}

		this.descr_elem.html(content);
	},
	getDescrElem: function(o){
		if (o){
			if (is_object(o)) o = obj_keys(o).join('"], [data-type="');
			return this.descr_elem.find('[data-type="'+o+'"]');
		}

		return this.descr_elements;
	},

	toggleHoverTable: function(elem, type){
		this.CheckFilter(elem);
		var res = this.getType(elem);
		var not_same = type !== res;
		this.map.ToggleHover(res, not_same);
		return not_same ? res : null;
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
