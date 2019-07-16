function random(min: number, max?: number): number {

    if (!max) {
        max = min;
        min = 0;
    }

    if (min === max) return min;

    if (min === 0 && max === 1) {
        return Math.random() < 0.5 ? 0 : 1;
    }
    return parseInt((1 + max - min) * Math.random() + min, 10);// +1 because max is never achieved
}

function range(min: number, max?: number): number[] {

    if (!max) {
        max = min;
        min = 0;
    }

    return Array.from({ length: max - min }).map((_, i) => i + min);
}

function randomElem<T>(arr: T[]): T | null {
    return arr[random(0, arr.length - 1)] || null;
}

function arr_first(a) {
    return a[0];
}
function arrLastElement<T>(a: T[]): T | null {
    return a.length > 0 ? a[a.length - 1] : null;
}
/**
 * говорит, есть ли хотя бы одна подстрока(-и) s в строке str
 * @param {string/array} s подстрока
 * @param {string} str строка
 * @returns {Boolean}
 */
function in_str(s, str) {
    if (is_array(s))
    {
        for (const i in s)
            if (in_str(s[i], str))
                return true;

        return false;
    }
    return str.toString().indexOf(s) != -1;
}
function in_objkeys(k: string, o: object) {
    return Object.keys(o).includes(k);
}
function Object.keys(o) {
    return Object.keys(o);
}
function obj_length(o) {
    return Object.keys(o).length;
}
function obj_real_keys(o) {
    const keys = [];
    for (const i in o) keys.push(i);
    return keys;
}
function obj_key(o, i) {
    return Object.keys(o)[i || 0];
}
function obj_first(o) {
    return o[obj_key(o)];
}
function obj_last(o) {
    return o[arrLastElement(Object.keys(o))];
}
function swap_obj_fields(o, f1, f2) {
    const tmp = o[f1];
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
function CheckObj(obj, key, def) {
    _Error.CheckType(obj, 'object', true);// strict

    if (obj[key] === undefined)
        obj[key] = (def === undefined) ? null : def;

    return obj[key];// ссылка на добавленный объект или текущее значение
}

function merge(a, b) {
    if (!is_('object', a)) return a = b;

    if (is_array(a) && is_array(b))
        a = Arr_merge(a, b);
    else
        a = Obj_merge(to_obj(a), to_obj(b));

    return a;
}
function Obj_merge(o1, o2) {
    _Error.CheckFunc(arguments, 2);
    o1 = to_obj(o1);
    o2 = to_obj(o2);

    for (const i in o2)
        o1[i] = in_objkeys(i, o1) ? merge(o1[i], o2[i]) : o2[i];

    return o1;
}
function Arr_merge(a1, a2) {
    _Error.CheckFunc(arguments, 2);

    if (!a1.length) return a1 = a2;

    for (const i in a2)
    {
        // ищем в первом массиве элемент второго
        const j = a1.indexOf(a2[i]);
        // если нашли - сливаем, иначе вставляем
        if (j === -1)
            a1.push(a2[i]);
        else
            a1[j] = merge(a1[j], a2[i]);
    }
    return a1;
}
function Arr_values(a) {
    const b = [];
    for (const i in a)
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
function Arr_filter(a, f, v, strict) {
    const result = [];

    for (const i in a) {
        if (strict) {
            if (a[i][f] === v)
                result.push(a[i]);
        }
        else{
            if (a[i][f] === v)
                result.push(a[i]);
        }
    }

    return result;
}

/**
 * проверяет тип переменной
 * @param {string} type
 * @param {mixed} o
 * @returns {Boolean}
 */
function is_(type, o) {
    _Error.CheckFunc(arguments, 2, true);

    if (typeof type === 'string') type = type.toLowerCase();

    if (in_str('dom',type)) return isDom(o);

    if (!o && (type === o || (
            (o === null        && type === 'null') ||
            (o === undefined && type === 'undefined') ||
            (o === ''        && type === 'string') ||
            (o === false    && in_str('bool',type)) ||
            (o === NaN        && type === 'nan')
        ))) {
        return true;
    }

    return typeof o === type;
}
function isDom(o) {
    return o && is_object(o) && o.length && (o.selector !== undefined) && o.context && true;
}
function is_array(o) {
    return o && (o instanceof Array);
}
function is_object(o) {
    return o && is_('object',o) && !is_array(o);
}

window.is_func = window.is_callable = function(func) {
    return func && is_('function', func);
};

function str_replace(_from, _to, subject) {
    if (is_array(subject)) {
        for (const i in subject) {
            subject[i] = str_replace(_from, _to, subject[i]);
        }
        return subject;
    }

    return subject.toString().replace(_from, _to);
}

function hasDigits(s) {
    return s.match(/[0-9]+/g);
}
function removeDigits(s,rep) {
    return s.replace(/[0-9]+/g, rep || '');
}
function hasLiterals(s) {
    return s.match(/[^0-9]+/g);
}
function removeLiterals(s,rep) {
    return s.replace(/[^0-9]+/g, rep || '');
}
function GetSelector(s, d) {
    return d + s.split(' ').join(d);
}

function ToggleElement() {
    const elem = arguments[0];
    const v = arguments[1];
    // заимствуем у массива метод копирования себя
    arguments.slice = Array.prototype.slice;

    // может, это селектор?
    if (!is_object(elem)) elem = $(elem);

    // передаем массив аргументов без первых двух
    elem[v ? 'show' : 'hide'].apply(elem, arguments.slice(2));
}
