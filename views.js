(function(w){
	var Html = {
		tag: function(elem, content, opt, open){
			if (is_object(content)){
				opt = Obj_copy(content);
				content = '';

				if (opt.content !== undefined){
					content = opt.content;
					delete opt.content;
				}
				if (opt.options) opt = opt.options;
			}
			else
				content = content === undefined || content === null ? '' : content;// чтобы не отсекался 0

			var opthtml = '';

			if (opt){
				_Error.CheckType(opt, 'object', true);

				if (is_object(opt.style)){
					var style = '';
					for (var p in opt.style){
						style += p+':'+opt.style[p]+';';
					}
					opt.style = style;
				}

				for (var o in opt)
					opthtml += ' '+o+'="'+opt[o]+'"';
			}

			return '<'+elem + opthtml + (open ? '/' : '')+'>' + (open ? '' : content+'</'+elem+'>');
		},
		br: '<br>',
		hr: '<hr>',

		a: function(content, opt){
			if (opt && !is_object(opt)) opt = {href: opt};
			return this.tag('a', content, opt);
		},
		i: function(_class, content){
			if (!is_object(_class)) _class = _class ? {'class':_class} : null;
			return this.tag('i', content, _class);
		},
		p: function(content, opt){
			return this.tag('p', content, opt);
		},
		sup: function(content, opt){
			return this.tag('sup', content, opt);
		},

		div: function(content, opt){
			return this.tag('div', content, opt);
		},
		span: function(content, opt){
			return this.tag('span', content, opt);
		},

		table: function(content, opt){
			return this.tag('table', content, opt);
		},
		tr: function(content, opt){
			return this.tag('tr', content, opt);
		},
		td: function(content, opt){
			return this.tag('td', content, opt);
		},

		ul: function(content, opt){
			return this.tag('ul', content, opt);
		},
		li: function(content, opt){
			return this.tag('li', content, opt);
		},

		button: function(content, opt){
			return this.tag('button', content, opt);
		},
		select: function(options, opt){
			return this.tag('select', this.getSelectOptions(options), opt);
		},
		input: function(opt){
			opt = opt || {};
			opt.type = opt.type || 'text';
			return this.tag('input', '', opt, true);
		},
		textarea: function(content, opt){
			return this.tag('textarea', content, opt);
		},

		img: function(src, opt){
			if (is_object(src))
				opt = src;
			else{
				if (!opt) opt = {};
				if (src) opt.src = src;
			}
			return this.tag('img', '', opt, true);
		},
		canvas: function(content, opt){
			return this.tag('canvas', content, opt);
		},
		script: function(content, opt){
			return this.tag('script', content, opt);
		},
		iframe: function(content, opt){
			return this.tag('iframe', content, opt);
		},
		form: function(content, opt){
			return this.tag('form', content, opt);
		},

		getSelectOptions: function(arr){
			if (!is_('object', arr)) return arr || '';

			var content = '';

			for (var o in arr)
				content += this.tag('option', arr[o], {value: o});

			return content;
		},
		getSelectedText: function(elem){
			elem = $(elem);
			return elem.find('option[value="'+elem.val()+'"]').text();
		},
		getSelectFirstVal: function(elem){
			return elem.find('option:first-of-type').attr('value');
		},
		getSelectValByText: function(elem, text){
			var v = 0;

			elem.children().each(function(){
				if ($(this).text() == text){
					v = $(this).attr('value');
					return false;
				}
			});

			return v;
		}
	};

	w.Views = {
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

		needFilter: function(elem){
			return $(elem).is('.filtered');
		},
		setFilter: function(elem){
			$(elem).addClass('filtered');
		},
		removeFilter: function(elem){
			$(elem).removeClass('filtered');
		},

		getElem: function(i,j, cls){
			if (is_array(i)){
				cls = j;
				j = i[1];
				i = i[0];
			}
			return this.map_elem.find((cls || '')+'[data-coo="'+i+'-'+j+'"]');
		},
		getCoo: function(elem){
			return elem.data('coo').split('-');
		},

		message: function(o){
			var m = this.message_elem;

			if (m){
				m.removeClass('hidden');
				m.html(o.text);
			}
			else{
				m = $(Html.span(o.text, {'class': 'modal-message'}));
				$('body').append(m);
				this.message_elem = m;
			}

			setTimeout(function(){m.addClass('hidden'); (o.success && o.success())}, o.ms || 1000);
		},

		description: function(receipts){
			var content = '';
			var res, tmp, title, obj, type;

			for (var i in receipts){
				res = '';

				for (var j in receipts[i]){
					tmp = receipts[i][j];

					for (var k=0; k<tmp.count; k++){
						res += Html.div({'class': 'pull-left', 'data-name': tmp.name});
					}
					title = tmp.title;
					obj = tmp.object;
					type = tmp.type;
				}
				content += Html.div(res+Html.div(title, {'class': 'pull-right'}), {'data-type': type, 'data-res': obj, 'class': 'disabled'});
			}

			this.descr_elem.html(content);
			this.descr_elements = this.descr_elem.find('[data-res]');
		},

		corners: function(o){
			var types = {vert: ['top','bottom'], hor: ['left','right']};
			var type = {vert: '', hor: ''};
			var content = '';
			var _data = o.data;

			for (var i in types.vert){
				type.vert = types.vert[i];
				if (!_data[type.vert]) continue;

				for (var j in types.hor){
					type.hor = types.hor[j];

					if (_data[type.hor]){
						var ci = type.vert == 'top' ? o.pos[0] : o.pos[0]+1;
						var cj = type.hor == 'left' ? o.pos[1] : o.pos[1]+1;

						content += Html.div({
							'class': 'corner '+type.vert+'-'+type.hor,
							'data-coo': ci+'-'+cj,
							'data-dir': type.vert+'-'+type.hor,
							'data-type': 'corner'
						});
					}
				}
			}

			this.getElem(o.pos).append(content);
		},
		lines: function(o){
			var types = ['top','bottom','left','right'];
			var type;
			var content = '';

			for (var i in types){
				type = types[i];

				if (o.data[type]){
					var top_left = type == 'top' || type == 'left';
					var li = top_left ? o.pos[0] : o.pos[0]+1;
					var lj = top_left ? o.pos[1] : o.pos[1]+1;

					content += Html.div({
						'class': 'line line-'+type,
						'data-coo': li+'-'+lj,
						'data-dir': type,
						'data-type': 'line'
					});
				}
			}

			this.getElem(o.pos).append(content);
		},
		map: function(_data){
			var content = '';

			for (var i in _data){
				var row = '';

				for (var j in _data[i])
				{
					var cell = _data[i][j];
					row += Html.td(cell && cell.name && {'data-name': cell.name, 'data-coo': i+'-'+j} || '');
				}
				content += Html.tr(row);
			}

			this.map_elem.html(Html.table(content));
		},

		change_hover_table: function(cls){
			this.map_elem.removeClass().addClass('map'+(cls ? ' '+cls : ''));
		},
		hide_hover_table: function(){
			this.change_hover_table();
		},
		show_hover_table: function(elem){
			var enabled = !this.isDisabled(elem);
			if (enabled){
				this.change_hover_table(this.getType(elem)+'-hover');
			}
			return enabled;
		},
		toggle_hover_table: function(elem, show){
			return this[(show ? 'show' : 'hide')+'_hover_table'](elem);
		},

		enter_number: function(title){
			return prompt(title);
		},

		getObjectElem: function(o){
			if (o){
				if (is_object(o)) o = obj_keys(o).join('"], [data-type="');
				return this.map_elem.find('[data-type="'+o+'"]');
			}

			return this.map_elem.find('[data-type]');
		},
		getAddedObject: function(type){
			return this.map_elem.find('added[data-type="'+type+'"]')
		},
		getFreeObject: function(type){
			return this.map_elem.find('[data-type="'+type+'"]:not(.added)');
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
			var $this = this;

			this.getAddedObject('line').each(function(){
				var elem = $(this);
				var pos = $this.getCoo(elem);
				var coo = [pos];

				switch (elem.data('dir')){
					case 'top':
					case 'bottom':
						coo.push([pos[0],pos[1]+1]);
						break;

					case 'left':
					case 'right':
						coo.push([pos[0]+1,pos[1]]);
						break;
				}

				for (var i in coo){
					$this.getElem(coo[i], '.corner').each(function(){
						if (!$(this).is('.added')) result.push(this);
					});
				}
			});

			return result;
		},
		getNearestLines: function(){
			var result = [];
			var $this = this;

			this.getAddedObject('corner').each(function(){
				var elem = $(this);
				var pos = $this.getCoo(elem);
				var coo = [pos, [pos[0]-1,pos[1]], [pos[0],pos[1]-1]];

				for (var i in coo){
					$this.getElem(coo[i], '.line').each(function(){
						if (!$(this).is('.added')) result.push(this);
					});
				}
			});

			return result;
		},
		enableNearest(type){
			this.disable(this.getFreeObject(type));
			var nearest = this.getNearest(type);

			for (var i in nearest){
				this.enable(nearest[i]);
			}
		},
		CheckFilter: function(elem){
			if (this.needFilter(elem))
				this.enableNearest(this.getType(elem));
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
			$(elem).addClass('added');
		},
		ObjectIsSet: function(elem){
			return $(elem).is('.added');
		}
	};
})(window);
