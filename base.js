;
window._Error = {
	Throw: function(msg, type, caller_name){
		caller_name = caller_name || this.Throw.caller.name;
		msg = (msg || '') + (caller_name ? ' в '+caller_name : '');
		throw type ? new TypeError(msg) : new Error(msg);
	},
	ThrowType: function(msg, caller_name){
		this.Throw(msg, true, caller_name || this.ThrowType.caller.name);
	},
	ThrowIf: function(condition, msg, caller_name){
		if (condition) this.Throw(msg, false, caller_name || this.ThrowIf.caller.name);
	},
	ThrowTypeIf: function(condition, msg, caller_name){
		if (condition) this.ThrowType(msg, caller_name || this.ThrowTypeIf.caller.name);
	},
	/**
	 * проверяет минимальное количество аргументов текущей функции
	 * @param {object/array} args объект/массив аргументов
	 * @param {int/string} count минимальное количество
	 * @param {bool} dont_check_for_empty не проверять аргументы на пустоту
	 */
	CheckFunc: function(args, count, dont_check_for_empty){
		var func = this.CheckFunc.caller.name;
		count = +count;

		if (count && args.length < count) this.ThrowType(func+' has not enouph arguments');
		if (dont_check_for_empty) return;

		for (var i in args)
			if (!args[i])
				this.ThrowType(i+NumberPostfix(i)+' argument of '+func+' must not to be empty');
	},
	/**
	 * проверяет тип переменной
	 * @param {mixed} arg переменная
	 * @param {string} type название типа
	 * @param {bool} object_not_array т.к. тип "object" есть и у null, и у массива, этот параметр позволяет их исключить
	 */
	CheckType: function(arg, type, object_strict){
		var func = this.CheckType.caller.name;

		this.ThrowTypeIf(
			in_array(type, ['array','Array']) ? !is_array(arg) : (type == 'object' && object_strict ? !is_object(arg) : !is_(type, arg)),
			arg+' is not a "'+type+'" type',
			func
		);
	}
};
window.Html = {
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

function random(min, max){
	if (min === max) return min;

	if (!max){
		max = min;
		min = 0;
	}
	if (min === 0 && max === 1){
		return 100*Math.random() < 50 ? 0 : 1;
	}
	return parseInt((max - min)*Math.random() + min);
}

function random_key(o){
	return random_elem(obj_keys(o));
}
function random_elem(arr){
	return arr[random(0, arr.length-1)];
}
function random_val(o){
	return o[random_key(o)];
}

window.arr_last = window.str_last = function(a){
	return a[a.length-1];
}

function in_obj_arr(arr, f, v){
	for (var i in arr){
		if (arr[i][f] === v) return true;
	}
	return false;
}

function sort_obj_arr(arr, f){
	arr.sort(function(a,b){
		return a[f] - b[f];
	});
	return arr;
}

function merge_obj_arr(a1, a2){
	for (var i=0; i<a2.length; i++){
		a1.push(a2[i]);
	}
}
function get_merged_obj_arr(a1, a2){
	var result = [];
	var i;

	for (i=0; i<a1.length; i++){
		result.push($.extend({},a1[i]));
	}
	for (i=0; i<a2.length; i++){
		result.push($.extend({},a2[i]));
	}

	return result;
}

function xor(a, b){
	return !a !== !b;
}
function xnor(a,b){
	return !a === !b;
}

function elements_count(a){
	return a ? (is_('object', a) ? (is_array(a) ? a.length : obj_keys(a)) : 1) : 0;
}
/**
 * фильтрует объект по полям
 * @param {object} obj объект
 * @param {array/object} keys массив полей/объект(старое поле -> новое поле)
 * @param {function} handle_func
 * @param {bool} unfilter фильтрует только отсутствующие поля (отсеивает совпадения)
 * @returns {object}
 */
function Obj_filter(obj, arr, handle_func, unfilter){
	if (!obj) return {};
	obj = to_obj(obj);

	var orig_key, cur_key;
	var result = {};
	var keys_is_object = is_object(arr);// фильтруем по ключам объекта
	var keys = keys_is_object ? obj_real_keys(obj) : obj_keys(obj);

	for (var i in arr){
		cur_key = keys_is_object ? i : arr[i];

		if (is_object(cur_key)){
			orig_key = obj_key(cur_key);// key
			cur_key = cur_key[orig_key];// value
		}
		else{
			orig_key = cur_key;// string
		}
		// if unfilter then (if not in array), else (if in array)
		if (unfilter !== in_array(orig_key, keys))
		{
			result[cur_key] = keys_is_object ? arr[i] : obj[orig_key];
			(handle_func && handle_func(result, cur_key));
		}
	}
	return result;
}
function Obj_copy(o){
	if (!o) return {};
	return $.extend(true, {}, o);
}
function copy_elements(acc, port, index_to_int){
	for (var i in port)
	{
		if (index_to_int) i = +i;

		if (is_array(acc))
			acc.push(port[i]);
		else
			acc[i] = port[i];
	}
	return acc;
}
function Arr_to_obj(a){
	return copy_elements({}, a || []);
}
function Obj_to_arr(o, index_to_int){
	return copy_elements([], o || {}, index_to_int);
}
function to_obj(a){
	if (!a) return {};

	if (is_('object', a)){
		if (is_array(a)) return Arr_to_obj(a);
		return a;
	}

	return {0: a};
}
function to_arr(a){
	if (!a && !is_zero(a)) return [];

	if (is_('object',a)){
		if (is_array(a)) return a;
		return Obj_to_arr(a);
	}

	return [a];
}
/**
 * if a in array arr
 * @param {mixed/array} a
 * @param {array} arr
 * @returns {Boolean}
 */
function in_array(a, arr){
	if (is_array(a)){
		for (var i in a)
			if (in_array(a[i], arr))
				return true;
	}
	return arr.indexOf(a) !== -1;
}
function arr_first(a){
	return a[0];
}
function arr_last(a){
	return a[a.length - 1];
}
/**
 * говорит, есть ли хотя бы одна подстрока(-и) s в строке str
 * @param {string/array} s подстрока
 * @param {string} str строка
 * @returns {Boolean}
 */
function in_str(s, str){
	if (is_array(s))
	{
		for (var i in s)
			if (in_str(s[i], str))
				return true;

		return false;
	}
	return str.indexOf(s) != -1;
}
function in_obj_keys(k, o){
	return in_array(k, obj_keys(o));
}
function obj_keys(o){
	return Object.keys(o);
}
function obj_length(o){
	return obj_keys(o).length;
}
function obj_real_keys(o){
	var keys = [];
	for (var i in o) keys.push(i);
	return keys;
}
function obj_key(o, i){
	return obj_keys(o)[i || 0];
}
function obj_first(o){
	return o[obj_key(o)];
}
function obj_last(o){
	return o[arr_last(obj_keys(o))];
}
function swap_obj_fields(o, f1, f2){
	var tmp = o[f1];
	o[f1] = o[f2];
	o[f2] = tmp;
}
/**
 * проверяет существование ключа у объекта с присовением ему значения по умолчанию
 * @param {object} obj объект
 * @param {string} key ключ
 * @param {mixed(null)} def значение по умолчанию
 * @returns {object}
 */
function CheckObj(obj, key, def){
	_Error.CheckType(obj, 'object', true);// strict

	if (obj[key] === undefined)
		obj[key] = (def === undefined) ? null : def;

	return obj[key];// ссылка на добавленный объект или текущее значение
}

function merge(a, b){
	if (!is_('object', a)) return a = b;

	if (is_array(a) && is_array(b))
		a = Arr_merge(a, b);
	else
		a = Obj_merge(to_obj(a), to_obj(b));

	return a;
}
function Obj_merge(o1, o2){
	_Error.CheckFunc(arguments, 2);
	o1 = to_obj(o1);
	o2 = to_obj(o2);

	for (var i in o2)
		o1[i] = in_obj_keys(i, o1) ? merge(o1[i], o2[i]) : o2[i];

	return o1;
}
function Arr_merge(a1, a2){
	_Error.CheckFunc(arguments, 2);

	if (!a1.length) return a1 = a2;

	for (var i in a2)
	{
		// ищем в первом массиве элемент второго
		var j = a1.indexOf(a2[i]);
		// если нашли - сливаем, иначе вставляем
		if (j == -1)
			a1.push(a2[i]);
		else
			a1[j] = merge(a1[j], a2[i]);
	}
	return a1;
}
function Arr_values(a){
	var b = [];
	for (var i in a)
		if (a[i] !== undefined) b.push(a[i]);
	return b;
}
/**
 * фильтрует массив объектов по полям либо по значению поля
 * @param {array} a
 * @param {string/array} f
 * @param {mixed} v
 * @returns {array}
 */
function Arr_filter(a, f, v, strict){
	//if (!v && !is_zero(v)) return a;
	var result = [];

	for (var i in a){
		if (strict){
			if (a[i][f] === v)
				result.push(a[i]);
		}
		else{
			if (a[i][f] == v)
				result.push(a[i]);
		}
	}

	return result;
}
/**
 * возвращает массив значений поля объектов
 * @param {array} a
 * @param {string} f
 * @param {mixed/array} exclude кроме этих значений
 * @returns {array}
 */
function GetObjectsFields(a, f, exclude){
	var result = [];
	exclude = to_arr(exclude);
	var v;

	for (var i in a){
		v = a[i][f];

		if (exclude && in_array(v, exclude)) continue;

		result.push(v);
	}
	return result;
}
function array_to_select(a, exclude, index_to_int){
	var result = {};
	exclude = to_arr(exclude);// not null or undefined
	var v;

	for (var i in a)
	{
		if (index_to_int) i = +i;

		v = a[i].name;

		if (exclude.length && in_array(v, exclude)) continue;

		result[a[i].id] = v;
	}
	return result;
}
/**
 * проверяет тип переменной
 * @param {string} type
 * @param {mixed} o
 * @returns {Boolean}
 */
function is_(type, o){
	_Error.CheckFunc(arguments, 2, true);

	if (typeof type == 'string') type = type.toLowerCase();

	if (in_str('dom',type)) return isDom(o);

	if (!o && (type === o || (
			(o === null		&& type == 'null') ||
			(o === undefined && type == 'undefined') ||
			(o === ''		&& type == 'string') ||
			(o === false	&& in_str('bool',type)) ||
			(o === NaN		&& type == 'nan')
		))){
		return true;
	}

	return typeof o == type;
}
function isDom(o){
	return o && is_object(o) && o.length && (o.selector !== undefined) && o.context && true;
}
function is_array(o){
	return o && (o instanceof Array);
}
function is_object(o){
	return o && is_('object',o) && !is_array(o);
}
function is_numeric(s){
	if (s === undefined || s === null || s === false) return false;

	s = s.toString();
	return hasDigits(s) && !hasLiterals(s);
}
function is_zero(s){
	return !+s && is_numeric(s);
}
window.is_func = window.is_callable = function(func){
	return func && is_('function', func);
};

function str_replace(_from, _to, subject){
	if (is_array(subject)){
		for (var i in subject){
			subject[i] = str_replace(_from, _to, subject[i]);
		}
		return subject;
	}

	return subject.toString().replace(_from, _to);
}
