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
		Bind: function(event, elem, handler){
			$(document).on(event, elem, function(e){
				handler(e, this);
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
		getType: function(elem){
			return $(elem).data('type');
		},
		getRes: function(elem){
			return $(elem).data('res');
		},

		getCell: function(i,j){
			if (is_array(i)){
				j = i[1];
				i = i[0];
			}
			return this.map_elem.find('[data-coo="'+i+'-'+j+'"]');
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

			var success;
			if (is_callable(o.ms)){
				success = o.ms;
				o.ms = null;
			}

			setTimeout(function(){m.addClass('hidden'); (success && success())}, o.ms || 1000);
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
						content += Html.div({'class': 'corner '+type.vert+'-'+type.hor, 'data-type': 'corner', 'data-res': _data.resources[type.vert][type.hor].join('-')});
					}
				}
			}

			this.getCell(o.pos).append(content);
		},
		lines: function(o){
			var types = ['top','bottom','left','right'];
			var type;
			var content = '';

			for (var i in types){
				type = types[i];

				if (o.data[type]){
					content += Html.div({'class': 'line line-'+type, 'data-type': 'line'});
				}
			}

			this.getCell(o.pos).append(content);
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
		show_hover_table: function(object_elem){
			if (!this.isDisabled(object_elem)){
				this.change_hover_table(this.getType(object_elem)+'-hover');
			}
		},

		enter_number: function(title){
			return prompt(title);
		},

		getDescrElem: function(o){
			if (o){
				return this.descr_elem.find('[data-res="'+obj_keys(o).join('"], [data-res="')+'"]');
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

		SetObject: function(elem){
			elem.addClass('added');
		}
	};
})(window);
