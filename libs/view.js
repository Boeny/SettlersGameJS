window.Views = {
	opened_menu: null,
	
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
		
		if (o.text){
			if (elem){
				elem.html(o.text);
				this.showModalMessage(elem);
			}
			else{
				elem = $(this.html.span(o.text, {'class': 'modal-message msg'}));
				this.main_elem.append(elem);
				this.message_elem = elem;
			}
		}
		
		var $this = this;
		setTimeout(function(){$this.hideModalMessage(elem); (o.success && o.success())}, o.ms || 1000);
	},
	
	toggleMenu: function(elem){
		if (this.opened_menu){
			this.dropup();
		}
		else{
			this.dropdown(elem);
		}
	},
	dropdown: function(elem){
		this.opened_menu = $(elem).next();
		this.opened_menu.slideDown();
	},
	dropup: function(){
		if (!this.opened_menu) return;
		this.opened_menu.slideUp();
		this.opened_menu = null;
	},
	
	// Game
	
	main: function(o){
		this.main_elem.append(
			this.html.div({
				'class': 'header',
				
				content: this.html.button('Новая игра', {'class': 'start_btn btn'})+
					this.html.button('Завершить ход', {'class': 'step_btn btn disabled'})
			})+
			this.html.div({
				'class': 'game_field',
				
				content: this.html.div({
						'class': 'map_container',
						content: this.html.div({'class': 'map'})
					})+
					this.html.div({'class': 'actual'})
			})+
			this.html.div({
				'class': 'bottom',
				
				content: this.html.div({'class': 'description'})
			})
		);
		
		this.setElements({
			header_elem: '.header',
			map_elem: '.map',
			descr_elem: '.description',
			act_elem: '.actual'
		});
		
		this.setActualData(o.actual);
		this.setDescrData(o.description);
		this.new_game(o);
	},
	new_game: function(o){
		this.setMapData(o.map);
		this.Trigger('next_step');
	},
	next_step: function(o){
		this.dropup();// close any menu if opened
		this.map.ToggleHover(o.map.hover);
		
		o.header = o.header || {};
		for (var name in o.header){
			this.toggle($('.'+name+'_btn'), o.header[name]);
		}
		
		_Error.ThrowTypeIf(!o.is_human && o.description.enabled.length, 'all must be disabled while comp is stepping', 'views.next_step');
		
		this.description.Toggle(o.description.enabled);
		this.description.Filter(o.description.filtered);
		
		if (o.is_human) this.actual.setObjects(o.actual);
		
		if (o.message){
			var $this = this;
			
			o.message.success = function(){
				$this.showDice(o.dice);
				
				/*if (!o.is_human){
					$this.Trigger('next_step');
				}*/
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
		_Error.ThrowTypeIf(!type, 'cell has no type');
		this.map.setType(type);
		
		if (this.needFilter(elem)){
			this.map.CreateNearest(type);
		}
		else
			this.map.CreateHovers(type);
	},
	toggleHoverTable: function(elem, old_type){
		var type = this.getType(elem);
		var show = old_type !== type;
		
		if (show){
			this.CheckFilter(elem);
		}
		
		this.map.ToggleHover(type, show);
		return show ? type : null;
	},
	check_enabled_objects: function(o){
		this.description.Filter(o.filtered);
		
		var objects = this.description.getElem();
		var result = [];
		var type;
		
		for (var i in o.enabled){
			type = o.enabled[i];
			
			if (!this.needFilter(objects[type]) || this.map.getNearest(type).length){
				result.push(type);
			}
		}
		
		return result;
	},
	
	// Description
	
	setDescrData: function(params){
		var o = $.extend({},params);
		o.parent = this;
		o.DOM = this.descr_elem;
		o.html = this.html;
		this.description = new this.Description(o);
	},
	
	// Actual
	
	setActualData: function(params){
		var o = $.extend({},params);
		o.parent = this;
		o.DOM = this.act_elem;
		o.html = this.html;
		this.actual = new this.Actual(o);
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
	},
	
	showDice: function(digit){
		if (digit) this.map.showDice(digit);
	}
};