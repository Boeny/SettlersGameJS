'use strict';

$(function(){
	$('body').css('z-index', 0);
	
	var setZ = function(elem, z){
		$(elem).children().each(function(){
			var elem = $(this);
			var this_z = elem.css('z-index');
			if (!this_z && this_z !== 0 || this_z === 'auto') elem.css('z-index', z);
			setZ(this, z+1);
		});
	};
	setZ('body', 1);
	
	var obj_map = function(o, func){
		var arr = [];
		for (var key in o){
			arr.push(func(key, o[key]));
		}
		return arr;
	};
	
	var is_array = function(a){
		return a instanceof Array;
	};
	var is_object = function(o){
		return o && typeof o == 'object' && !is_array(o);
	};
	var obj_length = function(o){
		return Object.keys(o).length;
	}
	
	var tag = function(elem, content, opt, open){
		if (is_object(content)){
			opt = $.extend(true, {}, content);
			content = '';
			
			if (opt.content !== undefined){
				content = opt.content;
				delete opt.content;
			}
			if (opt.options) opt = opt.options;
		}
		else
			content = content === 0 ? content : '';
		
		var attr = '';
		
		if (is_object(opt)){
			if (is_object(opt.style)){
				opt.style = obj_map(opt.style, (k,v) => k+':'+v+';').join();
			}
			
			if (obj_length(opt) > 0) attr = ' '+obj_map(opt, (k,v) => k+'="'+v+'"').join(' ');
		}
		
		return '<'+elem + attr+'>' + (open ? '' : content+'</'+elem+'>');
	};
	var div = function(content,opt){
		return tag('div',content,opt);
	};
	var span = function(content,opt){
		return tag('span',content,opt);
	};
	
	// when page is ready for appending the styling hover
	$('body').append(div({
		'id': 'visual__editable_element',
		'v-if': 'elem',
		'style': 'position: absolute; background: rgba(105, 161, 219, 0.5)',
		':style': 'styleObject',
		'key': 'element',
		
		content:span("{{ elem.localName }}",{style: 'color: rgb(201, 105, 219)'})+
				span("{{ elem.id ? elem.id : '' }}",{style: 'color: rgb(255, 158, 57)'})+
				span("{{ elem.className ? '.'+elem.className.split(' ').join('.') : '' }}", {style: 'color: rgb(102, 205, 245)'})+
				span("{{ styleObject.width + ' x ' + styleObject.height }}")
	}));
	
	var editable_element = new Vue({
		el: '#visual__editable_element',
		data: {
			elem: null,
			jquery_elem: null
		},
		computed: {
			styleObject: function(){
				var style = this.jquery_elem.offset();
				
				style = {
					width: this.jquery_elem.width()+'px',
					height: this.jquery_elem.height()+'px',
					top: style.top+'px',
					left: style.left+'px',
					'z-index': parseFloat(this.jquery_elem.css('z-index')) + 1
				};
				
				return style;
			}
		},
		methods: {
			setElement: function(elem){
				this.elem = elem;
				this.jquery_elem = $(elem);
			}
		}
	});

	$(document).on('mouseenter', '*', function(e){
		//if (this !== editable_element.elem && e.target !== editable_element.elem)
		editable_element.setElement(this);
		return false;
	});
});