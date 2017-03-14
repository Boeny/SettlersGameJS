module.exports = {
	tag: function(elem, content, opt, open){
		if (is_object(content)){
			opt = content;
			content = '';
			
			if (opt.content !== undefined){
				content = opt.content;
				delete opt.content;
			}
			if (opt.options) opt = opt.options;
		}
		else
			content = content === 0 && '0' || content || '';
		
		var opthtml = '';
		
		if (opt){
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
	type: '<!DOCTYPE html>',
	
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
	
	meta: function(opt){
		return this.tag('meta', '', opt, true);
	},
	title: function(content, opt){
		return this.tag('title', content, opt);
	},
	html: function(content, opt){
		return this.tag('html', content, opt);
	},
	head: function(content, opt){
		return this.tag('head', content, opt);
	},
	body: function(content, opt){
		return this.tag('body', content, opt);
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