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
		this.setDescrData(o.description);
		this.next_step(o);
	},
	next_step: function(o){
		this.map.ToggleHover(o.map.hover);

		o.header = o.header || {};
		for (var name in o.header){
			this.toggle($('.'+name+'_btn'), o.header[name]);
		}

		this.description.Toggle(o.description.enabled);
		this.description.Filter(o.description.filtered);

		if (o.message){
			var $this = this;

			o.message.success = function(){
				if (!o.is_human){
					$this.Trigger('next_step');
				}
			};

			this.message(o.message);
		}
	},

	// Map
	setMapData: function(params){
		var o = $.extend({},params);
		o.parent = this;
		o.DOM = this.map_elem;
		o.html = this.html;
		this.map = new this.Map(o);
	},
	CheckFilter: function(elem){
		var type = this.getType(elem);

		if (this.needFilter(elem))
			this.map.CreateNearest(type);
		else
			this.map.CreateHovers(type);
	},
	toggleHoverTable: function(elem, old_type){
		var type = this.getType(elem);
		var show = old_type !== type;

		if (show){
			this.map.setType(type);
			this.CheckFilter(elem);
		}

		this.map.ToggleHover(type, show);
		return show ? type : null;
	},

	// Description

	setDescrData: function(params){
		var o = $.extend({},params);
		o.parent = this;
		o.DOM = this.descr_elem;
		o.html = this.html;
		this.description = new this.Description(o);
	},

	// Filter

	needFilter: function(elem){
		return $(elem).is('.filtered');
	},
	setFilter: function(elem){
		$(elem).addClass('filtered');
	},
	toggleFilter: function(elem, filter){
		this[filter ? 'setFilter' : 'removeFilter'](elem);
	},
	removeFilter: function(elem){
		$(elem).removeClass('filtered');
	}
};
