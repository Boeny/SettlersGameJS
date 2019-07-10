window.Views = {
	Bind: function(event, elem, handler){
		if (is_callable(elem)){
			handler = elem;
			elem = document;
		}

		$(elem).on(event, function(e){
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
		if (is_object(show)){
			for (var name in show){
				this.toggle($(elem).find(name), show[name]);
			}
			return;
		}

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

	showModalMessage: function(elem){
		elem.removeClass('hidden');
	},
	hideModalMessage: function(elem){
		elem.addClass('hidden');
	},
	message: function(o){
		var elem = this.message_elem;

		if (elem){
			elem.html(o.text);
			this.showModalMessage(elem);
		}
		else{
			elem = $(this.html.span(o.text, {'class': 'modal-message msg'}));
			$('body').append(elem);
			this.message_elem = elem;
		}

		var $this = this;
		setTimeout(function(){$this.hideModalMessage(elem); (o.success && o.success())}, o.ms || 1000);
	},
	enter_number: function(o){
		var elem = this.prompt_elem;

		if (elem){
			elem.data('target', target);
			elem.find('.title').html(o.title);
			this.showModalMessage(elem);
		}
		else{
			elem = $(this.html.div({
				'class': 'modal-message prompt',
				'data-target': o.target,
				style: 'width: 300px; height: 200px',

				content: this.html.div(o.title, {'class': 'title'})+
					this.html.form(
						this.html.div(this.html.input({required: 'required'}))+
						this.html.div(this.html.button('OK', {type: 'submit'}))
					)
			}));

			$('body').append(elem);

			this.prompt_elem = elem;
			var input = elem.find('[type="text"]');

			var $this = this;
			this.Bind('click', elem.find('[type="submit"]'), function(e){
				if (input.val()){
					e.preventDefault();
					$this.Trigger('number_entered', elem);
				}
			});
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

		for (var name in o.header){
			o.header[name] = '.'+o.header[name]+'_btn';
		}

		this.toggle(this.header_elem, o.header);
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
		var row, obj, title, type;
		var list = o.list;

		for (var i in list){
			row = '';
			obj = list[0][0];
			title = obj.title;
			type = obj.type;

			for (var j in list[i]){
				obj = list[i][j];

				for (var k=0; k<obj.count; k++){
					row += this.html.div({'class': 'pull-left', 'data-type': obj.resource});
				}
			}

			var classes = [];
			if (in_array(type, o.enabled)) classes.push('disabled');
			if (in_array(type, o.filtered)) classes.push('filtered');

			content += this.html.div(row + this.html.div(title, {'class': 'pull-right'}), {'data-type': type, 'class': classes.join(' ')});
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
		var res = this.getRes(elem);
		return this.toggle_hover_table(elem, type !== res) ? res : null;
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
