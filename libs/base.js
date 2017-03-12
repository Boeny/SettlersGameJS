global.random = function(min, max){
	if (!max){
		max = min;
		min = 0;
	}
	
	if (min === max) return min;
	
	if (min === 0 && max === 1){
		return 100*Math.random() < 50 ? 0 : 1;
	}
	return parseInt((1 + max - min)*Math.random() + min);// +1 because max is never achieved
}

global.random_key = function(o){
	return random_elem(obj_keys(o));
}
global.random_elem = function(arr){
	return arr[random(0, arr.length-1)];
}
global.random_val = function(o){
	return o[random_key(o)];
}

global.arr_last = global.str_last = function(a){
	return a[a.length-1];
}

global.xor = function(a, b){
	return !a !== !b;
}
global.xnor = function(a,b){
	return !a === !b;
}

/**
 * if a in array arr 
 * @param {mixed/array} a
 * @param {array} arr
 * @returns {Boolean}
 */
global.in_array = function(a, arr){
	if (is_array(a)){
		for (var i in a)
			if (in_array(a[i], arr))
				return true;
	}
	return arr.indexOf(a) !== -1;
}
global.arr_first = function(a){
	return a[0];
}
global.arr_last = function(a){
	return a[a.length - 1];
}
global.arr_remove = function(a,v){
	var i = a.indexOf(v);
	if (i !== -1) a.splice(i,1);
	return a;
}
/**
 * говорит, есть ли хотя бы одна подстрока(-и) s в строке str
 * @param {string/array} s подстрока
 * @param {string} str строка
 * @returns {Boolean}
 */
global.in_str = function(s, str){
	if (is_array(s))
	{
		for (var i in s)
			if (in_str(s[i], str))
				return true;
		
		return false;
	}
	return str.toString().indexOf(s) != -1;
}
global.in_obj_keys = function(k, o){
	return in_array(k, obj_keys(o));
}
global.obj_keys = function(o){
	return Object.keys(o);
}
global.obj_length = function(o){
	return obj_keys(o).length;
}
global.obj_real_keys = function(o){
	var keys = [];
	for (var i in o) keys.push(i);
	return keys;
}
global.obj_key = function(o, i){
	return obj_keys(o)[i || 0];
}
global.obj_first = function(o){
	return o[obj_key(o)];
}
global.obj_last = function(o){
	return o[arr_last(obj_keys(o))];
}
global.swap_obj_fields = function(o, f1, f2){
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
global.CheckObj = function(obj, key, def){
	if (obj[key] === undefined)
		obj[key] = (def === undefined) ? null : def;
	
	return obj[key];// ссылка на добавленный объект или текущее значение
}

global.array_to_select = function(a, index_to_int){
	var result = {};
	var v;
	
	for (var i in a)
	{
		if (index_to_int) i = +i;
		
		v = a[i].name;
		
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
global.is_ = function(type, o){
	if (typeof type == 'string') type = type.toLowerCase();
	
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
global.is_bool = function(o){
	return is_('boolean', o);
}
global.is_array = function(o){
	return o && (o instanceof Array);
}
global.is_object = function(o){
	return o && is_('object',o) && !is_array(o);
}
global.is_numeric = function(s){
	if (s === undefined || s === null || s === false) return false;
	
	s = s.toString();
	return hasDigits(s) && !hasLiterals(s);
}
global.is_zero = function(s){
	return !+s && is_numeric(s);
}
global.is_func = global.is_callable = function(func){
	return func && is_('function', func);
};

global.arr_create = function(count, v){
	var r = [];
	iterate(count, function(i){
		r.push(v === undefined ? i : v);
	});
	return r;
}
global.str_create = function(count, v){
	return arr_create(count, v).join();
}

global.iterate = function(count, func){
	for (var i=0; i<count; i++){
		if (func(i) === false)
			break;
	}
}