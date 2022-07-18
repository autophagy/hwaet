(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.K.z === region.Q.z)
	{
		return 'on line ' + region.K.z;
	}
	return 'on lines ' + region.K.z + ' through ' + region.Q.z;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aw,
		impl.aE,
		impl.aC,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		o: func(record.o),
		L: record.L,
		I: record.I
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.o;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.L;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.I) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aw,
		impl.aE,
		impl.aC,
		function(sendToApp, initialModel) {
			var view = impl.aF;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aw,
		impl.aE,
		impl.aC,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.J && impl.J(sendToApp)
			var view = impl.aF;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.ap);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.aD) && (_VirtualDom_doc.title = title = doc.aD);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.ay;
	var onUrlRequest = impl.az;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		J: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.ac === next.ac
							&& curr.U === next.U
							&& curr._.a === next._.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		aw: function(flags)
		{
			return A3(impl.aw, flags, _Browser_getUrl(), key);
		},
		aF: impl.aF,
		aE: impl.aE,
		aC: impl.aC
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { au: 'hidden', aq: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { au: 'mozHidden', aq: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { au: 'msHidden', aq: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { au: 'webkitHidden', aq: 'webkitvisibilitychange' }
		: { au: 'hidden', aq: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		ag: _Browser_getScene(),
		aj: {
			al: _Browser_window.pageXOffset,
			am: _Browser_window.pageYOffset,
			ak: _Browser_doc.documentElement.clientWidth,
			T: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		ak: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		T: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			ag: {
				ak: node.scrollWidth,
				T: node.scrollHeight
			},
			aj: {
				al: node.scrollLeft,
				am: node.scrollTop,
				ak: node.clientWidth,
				T: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			ag: _Browser_getScene(),
			aj: {
				al: x,
				am: y,
				ak: _Browser_doc.documentElement.clientWidth,
				T: _Browser_doc.documentElement.clientHeight
			},
			as: {
				al: x + rect.left,
				am: y + rect.top,
				ak: rect.width,
				T: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.a) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.c);
		} else {
			var treeLen = builder.a * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.d) : builder.d;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.c);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{d: nodeList, a: (len / $elm$core$Array$branchFactor) | 0, c: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {S: fragment, U: host, Y: path, _: port_, ac: protocol, ad: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$Gen = {$: 0};
var $author$project$Main$Model = F3(
	function (text, sentences, paragraphs) {
		return {A: paragraphs, B: sentences, M: text};
	});
var $author$project$Main$NewText = function (a) {
	return {$: 2, a: a};
};
var $author$project$Beowulf$beowulf = _List_fromArray(
	['We Gardena in geardagum, þeodcyninga, þrym gefrunon, hu ða æþelingas ellen fremedon.', 'Oft Scyld Scefing sceaþena þreatum, monegum mægþum, meodosetla ofteah, egsode eorlas.', 'Syððan ærest wearð feasceaft funden, he þæs frofre gebad, weox under wolcnum, weorðmyndum þah, oðþæt him æghwylc þara ymbsittendra ofer hronrade hyran scolde, gomban gyldan.', 'Þæt wæs god cyning.', 'Ðæm eafera wæs æfter cenned, geong in geardum, þone god sende folce to frofre; fyrenðearfe ongeat þe hie ær drugon aldorlease lange hwile.', 'Him þæs liffrea, wuldres wealdend, woroldare forgeaf; Beowulf wæs breme blæd wide sprang, Scyldes eafera Scedelandum in.', 'Swa sceal geong guma gode gewyrcean, fromum feohgiftum on fæder bearme, þæt hine on ylde eft gewunigen wilgesiþas, þonne wig cume, leode gelæsten; lofdædum sceal in mægþa gehwære man geþeon.', 'Him ða Scyld gewat to gescæphwile felahror feran on frean wære.', 'Hi hyne þa ætbæron to brimes faroðe, swæse gesiþas, swa he selfa bæd, þenden wordum weold wine Scyldinga; leof landfruma lange ahte.', 'Þær æt hyðe stod hringedstefna, isig ond utfus, æþelinges fær.', 'Aledon þa leofne þeoden, beaga bryttan, on bearm scipes, mærne be mæste.', 'Þær wæs madma fela of feorwegum, frætwa, gelæded; ne hyrde ic cymlicor ceol gegyrwan hildewæpnum ond heaðowædum, billum ond byrnum; him on bearme læg madma mænigo, þa him mid scoldon on flodes æht feor gewitan.', 'Nalæs hi hine læssan lacum teodan, þeodgestreonum, þon þa dydon þe hine æt frumsceafte forð onsendon ænne ofer yðe umborwesende.', 'Þa gyt hie him asetton segen geldenne heah ofer heafod, leton holm beran, geafon on garsecg; him wæs geomor sefa, murnende mod.', 'Men ne cunnon secgan to soðe, selerædende, hæleð under heofenum, hwa þæm hlæste onfeng.', 'Ða wæs on burgum Beowulf Scyldinga, leof leodcyning, longe þrage folcum gefræge fæder ellor hwearf, aldor of earde, oþþæt him eft onwoc heah Healfdene; heold þenden lifde, gamol ond guðreouw, glæde Scyldingas.', 'Ðæm feower bearn forð gerimed in worold wocun, weoroda ræswan, Heorogar ond Hroðgar ond Halga til; hyrde ic þæt wæs Onelan cwen, Heaðoscilfingas healsgebedda.', 'Þa wæs Hroðgare heresped gyfen, wiges weorðmynd, þæt him his winemagas georne hyrdon, oðð þæt seo geogoð geweox, magodriht micel.', 'Him on mod bearn þæt healreced hatan wolde, medoærn micel, men gewyrcean þonne yldo bearn æfre gefrunon, ond þær on innan eall gedælan geongum ond ealdum, swylc him god sealde, buton folcscare ond feorum gumena.', 'Ða ic wide gefrægn weorc gebannan manigre mægþe geond þisne middangeard, folcstede frætwan.', 'Him on fyrste gelomp, ædre mid yldum, þæt hit wearð ealgearo, healærna mæst; scop him Heort naman se þe his wordes geweald wide hæfde.', 'He beot ne aleh, beagas dælde, sinc æt symle.', 'Sele hlifade, heah ond horngeap, heaðowylma bad, laðan liges; ne wæs hit lenge þa gen þæt se ecghete aþumsweorum, æfter wælniðe wæcnan scolde.', 'Ða se ellengæst earfoðlice þrage geþolode, se þe in þystrum bad, þæt he dogora gehwam dream gehyrde hludne in healle; þær wæs hearpan sweg, swutol sang scopes.', 'Sægde se þe cuþe frumsceaft fira feorran reccan, cwæð þæt se ælmihtiga eorðan worhte, wlitebeorhtne wang, swa wæter bebugeð, gesette sigehreþig sunnan ond monan leoman to leohte landbuendum ond gefrætwade foldan sceatas leomum ond leafum, lif eac gesceop cynna gehwylcum þara ðe cwice hwyrfaþ.', 'Swa ða drihtguman dreamum lifdon eadiglice, oððæt an ongan fyrene fremman feond on helle.', 'Wæs se grimma gæst Grendel haten, mære mearcstapa, se þe moras heold, fen ond fæsten; fifelcynnes eard wonsæli wer weardode hwile, siþðan him scyppend forscrifen hæfde in Caines cynne.', 'Þone cwealm gewræc ece drihten, þæs þe he Abel slog; ne gefeah he þære fæhðe, ac he hine feor forwræc, metod for þy mane, mancynne fram.', 'Þanon untydras ealle onwocon, eotenas ond ylfe ond orcneas, swylce gigantas, þa wið gode wunnon lange þrage; he him ðæs lean forgeald.', 'Gewat ða neosian, syþðan niht becom, hean huses, hu hit Hringdene æfter beorþege gebun hæfdon.', 'Fand þa ðær inne æþelinga gedriht swefan æfter symble; sorge ne cuðon, wonsceaft wera.', 'Wiht unhælo, grim ond grædig, gearo sona wæs, reoc ond reþe, ond on ræste genam þritig þegna, þanon eft gewat huðe hremig to ham faran, mid þære wælfylle wica neosan.', 'Ða wæs on uhtan mid ærdæge Grendles guðcræft gumum undyrne; þa wæs æfter wiste wop up ahafen, micel morgensweg.', 'Mære þeoden, æþeling ærgod, unbliðe sæt, þolode ðryðswyð, þegnsorge dreah, syðþan hie þæs laðan last sceawedon, wergan gastes; wæs þæt gewin to strang, lað ond longsum.', 'Næs hit lengra fyrst, ac ymb ane niht eft gefremede morðbeala mare ond no mearn fore, fæhðe ond fyrene; wæs to fæst on þam.', 'Þa wæs eaðfynde þe him elles hwær gerumlicor ræste sohte, bed æfter burum, ða him gebeacnod wæs, gesægd soðlice sweotolan tacne healðegnes hete; heold hyne syðþan fyr ond fæstor se þæm feonde ætwand.', 'Swa rixode ond wið rihte wan, ana wið eallum, oðþæt idel stod husa selest.', 'Wæs seo hwil micel; XII wintra tid torn geþolode wine Scyldinga, weana gehwelcne, sidra sorga.', 'Forðam secgum wearð, ylda bearnum, undyrne cuð, gyddum geomore, þætte Grendel wan hwile wið Hroþgar, heteniðas wæg, fyrene ond fæhðe fela missera, singale sæce, sibbe ne wolde wið manna hwone mægenes Deniga, feorhbealo feorran, fea þingian, ne þær nænig witena wenan þorfte beorhtre bote to banan folmum, ac se æglæca ehtende wæs, deorc deaþscua, duguþe ond geogoþe, seomade ond syrede, sinnihte heold mistige moras.', 'men ne cunnon hwyder helrunan hwyrftum scriþað.', 'Swa fela fyrena feond mancynnes, atol angengea, oft gefremede, heardra hynða.', 'Heorot eardode, sincfage sel sweartum nihtum; no he þone gifstol gretan moste, maþðum for metode, ne his myne wisse.', 'Þæt wæs wræc micel wine Scyldinga, modes brecða.', 'Monig oft gesæt rice to rune; ræd eahtedon hwæt swiðferhðum selest wære wið færgryrum to gefremmanne.', 'Hwilum hie geheton æt hærgtrafum wigweorþunga, wordum bædon þæt him gastbona geoce gefremede wið þeodþreaum.', 'Swylc wæs þeaw hyra, hæþenra hyht; helle gemundon in modsefan, metod hie ne cuþon, dæda demend, ne wiston hie drihten god, ne hie huru heofena helm herian ne cuþon, wuldres waldend.', 'Wa bið þæm ðe sceal þurh sliðne nið sawle bescufan in fyres fæþm, frofre ne wenan, wihte gewendan; wel bið þæm þe mot æfter deaðdæge drihten secean ond to fæder fæþmum freoðo wilnian.', 'Swa ða mælceare maga Healfdenes singala seað, ne mihte snotor hæleð wean onwendan; wæs þæt gewin to swyð, laþ ond longsum, þe on ða leode becom, nydwracu niþgrim, nihtbealwa mæst.', 'Þæt fram ham gefrægn Higelaces þegn, god mid Geatum, Grendles dæda; se wæs moncynnes mægenes strengest on þæm dæge þysses lifes, æþele ond eacen.', 'Het him yðlidan godne gegyrwan, cwæð, hu guðcyning ofer swanrade secean wolde, mærne þeoden, þa him wæs manna þearf.', 'Ðone siðfæt him snotere ceorlas lythwon logon, þeah he him leof wære; hwetton higerofne, hæl sceawedon.', 'Hæfde se goda Geata leoda cempan gecorone þara þe he cenoste findan mihte; XVna sum sundwudu sohte; secg wisade, lagucræftig mon, landgemyrcu.', 'Fyrst forð gewat.', 'Flota wæs on yðum, bat under beorge.', 'Beornas gearwe on stefn stigon; streamas wundon, sund wið sande; secgas bæron on bearm nacan beorhte frætwe, guðsearo geatolic; guman ut scufon, weras on wilsið, wudu bundenne.', 'Gewat þa ofer wægholm, winde gefysed, flota famiheals fugle gelicost, oðþæt ymb antid oþres dogores wundenstefna gewaden hæfde þæt ða liðende land gesawon, brimclifu blican, beorgas steape, side sænæssas; þa wæs sund liden, eoletes æt ende.', 'Þanon up hraðe Wedera leode on wang stigon, sæwudu sældon syrcan hrysedon, guðgewædo, gode þancedon þæs þe him yþlade eaðe wurdon.', 'Þa of wealle geseah weard Scildinga, se þe holmclifu healdan scolde, beran ofer bolcan beorhte randas, fyrdsearu fuslicu; hine fyrwyt bræc modgehygdum, hwæt þa men wæron.', 'Gewat him þa to waroðe wicge ridan þegn Hroðgares, þrymmum cwehte mægenwudu mundum, meþelwordum frægn: Hwæt syndon ge searohæbbendra, byrnum werede, þe þus brontne ceol ofer lagustræte lædan cwomon, hider ofer holmas? le wæs endesæta, ægwearde heold, þe on land Dena laðra nænig mid scipherge sceðþan ne meahte.', 'No her cuðlicor cuman ongunnon lindhæbbende; ne ge leafnesword guðfremmendra gearwe ne wisson, maga gemedu.', 'Næfre ic maran geseah eorla ofer eorþan ðonne is eower sum, secg on searwum; nis þæt seldguma, wæpnum geweorðad, næfne him his wlite leoge, ænlic ansyn.', 'Nu ic eower sceal frumcyn witan, ær ge fyr heonan , leassceaweras, on land Dena furþur feran.', 'Nu ge feorbuend, mereliðende, minne gehyrað anfealdne geþoht: Ofost is selest to gecyðanne hwanan eowre cyme syndon.', 'Him se yldesta ondswarode, werodes wisa, wordhord onleac: We synt gumcynnes Geata leode ond Higelaces heorðgeneatas.', 'Wæs min fæder folcum gecyþed, æþele ordfruma, Ecgþeow haten.', 'Gebad wintra worn, ær he on weg hwurfe, gamol of geardum; hine gearwe geman witena welhwylc wide geond eorþan.', 'We þurh holdne hige hlaford þinne, sunu Healfdenes, secean cwomon, leodgebyrgean; wes þu us larena god.', 'Habbað we to þæm mæran micel ærende, Deniga frean, ne sceal þær dyrne sum wesan, þæs ic wene.', 'Þu wast gif hit is swa we soþlice secgan hyrdon þæt mid Scyldingum sceaðona ic nat hwylc, deogol dædhata, deorcum nihtum eaweð þurh egsan uncuðne nið, hynðu ond hrafyl.', 'Ic þæs Hroðgar mæg þurh rumne sefan ræd gelæran, hu he frod ond god feond oferswyðeþ, gyf him edwendan æfre scolde bealuwa bisigu, bot eft cuman, ond þa cearwylmas colran wurðaþ; oððe a syþðan earfoðþrage, þreanyd þolað, þenden þær wunað on heahstede husa selest.', 'Weard maþelode, ðær on wicge sæt, ombeht unforht: æghwæþres sceal scearp scyldwiga gescad witan, worda ond worca, se þe wel þenceð.', 'Ic þæt gehyre, þæt þis is hold weorod frean Scyldinga.', 'Gewitaþ forð beran wæpen ond gewædu; ic eow wisige.', 'Swylce ic maguþegnas mine hate wið feonda gehwone flotan eowerne, niwtyrwydne nacan on sande arum healdan, oþðæt eft byreð ofer lagustreamas leofne mannan wudu wundenhals to Wedermearce, godfremmendra swylcum gifeþe bið þæt þone hilderæs hal gedigeð.', 'Gewiton him þa feran.', 'Flota stille bad, seomode on sale sidfæþmed scip, on ancre fæst.', 'Eoforlic scionon ofer hleorberan gehroden golde, fah ond fyrheard; ferhwearde heold guþmod grimmon.', 'Guman onetton, sigon ætsomne, oþþæt hy sæl timbred, geatolic ond goldfah, ongyton mihton; þæt wæs foremærost foldbuendum receda under roderum, on þæm se rica bad; lixte se leoma ofer landa fela.', 'Him þa hildedeor hof modigra torht getæhte, þæt hie him to mihton gegnum gangan; guðbeorna sum wicg gewende, word æfter cwæð: Mæl is me to feran; fæder alwalda mid arstafum eowic gehealde siða gesunde.', 'Ic to sæ wille wið wrað werod wearde healdan.', 'Stræt wæs stanfah, stig wisode gumum ætgædere.', 'Guðbyrne scan heard hondlocen, hringiren scir song in searwum, þa hie to sele furðum in hyra gryregeatwum gangan cwomon.', 'Setton sæmeþe side scyldas, rondas regnhearde, wið þæs recedes weal, bugon þa to bence.', 'Byrnan hringdon, guðsearo gumena; garas stodon, sæmanna searo, samod ætgædere, æscholt ufan græg; wæs se irenþreat wæpnum gewurþad.', 'Þa ðær wlonc hæleð oretmecgas æfter æþelum frægn: Hwanon ferigeað ge fætte scyldas, græge syrcan ond grimhelmas, heresceafta heap? Ic eom Hroðgares ar ond ombiht.', 'Ne seah ic elþeodige þus manige men modiglicran.', 'Wen ic þæt ge for wlenco, nalles for wræcsiðum, ac for higeþrymmum Hroðgar sohton.', 'Him þa ellenrof andswarode, wlanc Wedera leod, word æfter spræc, heard under helme: We synt Higelaces beodgeneatas; Beowulf is min nama.', 'Wille ic asecgan sunu Healfdenes, mærum þeodne, min ærende, aldre þinum, gif he us geunnan wile þæt we hine swa godne gretan moton.', 'Wulfgar maþelode þæt wæs Wendla leod; wæs his modsefa manegum gecyðed, wig ond wisdom: Ic þæs wine Deniga, frean Scildinga, frinan wille, beaga bryttan, swa þu bena eart, þeoden mærne, ymb þinne sið, ond þe þa ondsware ædre gecyðan ðe me se goda agifan þenceð.', 'Hwearf þa hrædlice þær Hroðgar sæt eald ond anhar mid his eorla gedriht; eode ellenrof, þæt he for eaxlum gestod Deniga frean; cuþe he duguðe þeaw.', 'Wulfgar maðelode to his winedrihtne: Her syndon geferede, feorran cumene ofer geofenes begang Geata leode; þone yldestan oretmecgas Beowulf nemnað.', 'Hy benan synt þæt hie, þeoden min, wið þe moton wordum wrixlan.', 'No ðu him wearne geteoh ðinra gegncwida, glædman Hroðgar.', 'Hy on wiggetawum wyrðe þinceað eorla geæhtlan; huru se aldor deah, se þæm heaðorincum hider wisade.', 'Hroðgar maþelode, helm Scyldinga: Ic hine cuðe cnihtwesende.', 'Wæs his ealdfæder Ecgþeo haten, ðæm to ham forgeaf Hreþel Geata angan dohtor; is his eafora nu heard her cumen, sohte holdne wine.', 'Ðonne sægdon þæt sæliþende, þa ðe gifsceattas Geata fyredon þyder to þance, þæt he XXXtiges manna mægencræft on his mundgripe heaþorof hæbbe.', 'Hine halig god for arstafum us onsende, to Westdenum, þæs ic wen hæbbe, wið Grendles gryre.', 'Ic þæm godan sceal for his modþræce madmas beodan.', 'Beo ðu on ofeste, hat in gan seon sibbegedriht samod ætgædere; gesaga him eac wordum þæt hie sint wilcuman Deniga leodum.', '[] word inne abead: Eow het secgan sigedrihten min, aldor Eastdena, þæt he eower æþelu can, ond ge him syndon ofer sæwylmas heardhicgende hider wilcuman.', 'Nu ge moton gangan in eowrum guðgeatawum under heregriman Hroðgar geseon; lætað hildebord her onbidan, wudu, wælsceaftas, worda geþinges.', 'Aras þa se rica, ymb hine rinc manig, þryðlic þegna heap; sume þær bidon, heaðoreaf heoldon, swa him se hearda bebead.', 'Snyredon ætsomne, þa secg wisode, under Heorotes hrof heard under helme, þæt he on heoðe gestod.', 'Beowulf maðelode on him byrne scan, searonet seowed smiþes orþancum: Wæs þu, Hroðgar, hal.', 'Ic eom Higelaces mæg ond magoðegn; hæbbe ic mærða fela ongunnen on geogoþe.', 'Me wearð Grendles þing on minre eþeltyrf undyrne cuð; secgað sæliðend þæt þæs sele stande, reced selesta, rinca gehwylcum idel ond unnyt, siððan æfenleoht under heofenes hador beholen weorþeð.', 'Þa me þæt gelærdon leode mine þa selestan, snotere ceorlas, þeoden Hroðgar, þæt ic þe sohte, forþan hie mægenes cræft minne cuþon, selfe ofersawon, ða ic of searwum cwom, fah from feondum.', 'Þær ic fife geband, yðde eotena cyn ond on yðum slog niceras nihtes, nearoþearfe dreah, wræc Wedera nið wean ahsodon, forgrand gramum, ond nu wið Grendel sceal, wið þam aglæcan, ana gehegan ðing wið þyrse.', 'Ic þe nu ða, brego Beorhtdena, biddan wille, eodor Scyldinga, anre bene, þæt ðu me ne forwyrne, wigendra hleo, freowine folca, nu ic þus feorran com, þæt ic mote ana ond minra eorla gedryht, þes hearda heap, Heorot fælsian.', 'Hæbbe ic eac geahsod þæt se æglæca for his wonhydum wæpna ne recceð.', 'Ic þæt þonne forhicge swa me Higelac sie, min mondrihten, modes bliðe, þæt ic sweord bere oþðe sidne scyld, geolorand to guþe, ac ic mid grape sceal fon wið feonde ond ymb feorh sacan, lað wið laþum; ðær gelyfan sceal dryhtnes dome se þe hine deað nimeð.', 'Wen ic þæt he wille, gif he wealdan mot, in þæm guðsele Geotena leode etan unforhte, swa he oft dyde, mægen Hreðmanna.', 'Na þu minne þearft hafalan hydan, ac he me habban wile dreore fahne, gif mec deað nimeð.', 'Byreð blodig wæl, byrgean þenceð, eteð angenga unmurnlice, mearcað morhopu; no ðu ymb mines ne þearft lices feorme leng sorgian.', 'Onsend Higelace, gif mec hild nime, beaduscruda betst, þæt mine breost wereð, hrægla selest; þæt is Hrædlan laf, Welandes geweorc.', 'Gæð a wyrd swa hio scel.', 'Hroðgar maþelode, helm Scyldinga: For gewyrhtum þu, wine min Beowulf, ond for arstafum usic sohtest.', 'Gesloh þin fæder fæhðe mæste; wearþ he Heaþolafe to handbonan mid Wilfingum; ða hine Wedera cyn for herebrogan habban ne mihte.', 'Þanon he gesohte Suðdena folc ofer yða gewealc, Arscyldinga.', 'Ða ic furþum weold folce Deniga ond on geogoðe heold ginne rice, hordburh hæleþa; ða wæs Heregar dead, min yldra mæg unlifigende, bearn Healfdenes; se wæs betera ðonne ic.', 'Siððan þa fæhðe feo þingode; sende ic Wylfingum ofer wæteres hrycg ealde madmas; he me aþas swor.', 'Sorh is me to secganne on sefan minum gumena ængum hwæt me Grendel hafað hynðo on Heorote mid his heteþancum, færniða gefremed.', 'Is min fletwerod, wigheap gewanod; hie wyrd forsweop on Grendles gryre.', 'God eaþe mæg þone dolsceaðan dæda getwæfan.', 'Ful oft gebeotedon beore druncne ofer ealowæge oretmecgas þæt hie in beorsele bidan woldon Grendles guþe mid gryrum ecga.', 'Ðonne wæs þeos medoheal on morgentid, drihtsele dreorfah, þonne dæg lixte, eal bencþelu blode bestymed, heall heorudreore; ahte ic holdra þy læs, deorre duguðe, þe þa deað fornam.', 'Site nu to symle ond onsæl meoto, sigehreð secgum, swa þin sefa hwette.', 'Þa wæs Geatmæcgum geador ætsomne on beorsele benc gerymed; þær swiðferhþe sittan eodon, þryðum dealle.', 'Þegn nytte beheold, se þe on handa bær hroden ealowæge, scencte scir wered.', 'Scop hwilum sang hador on Heorote.', 'Þær wæs hæleða dream, duguð unlytel Dena ond Wedera.', 'Unferð maþelode, Ecglafes bearn, þe æt fotum sæt frean Scyldinga, onband beadurune wæs him Beowulfes sið, modges merefaran, micel æfþunca, forþon þe he ne uþe þæt ænig oðer man æfre mærða þon ma middangeardes gehedde under heofenum þonne he sylfa: Eart þu se Beowulf, se þe wið Brecan wunne, on sidne sæ ymb sund flite, ðær git for wlence wada cunnedon ond for dolgilpe on deop wæter aldrum neþdon? Ne inc ænig mon, ne leof ne lað, belean mihte sorhfullne sið, þa git on sund reon.', 'Þær git eagorstream earmum þehton, mæton merestræta, mundum brugdon, glidon ofer garsecg; geofon yþum weol, wintrys wylmum.', 'Git on wæteres æht seofon niht swuncon; he þe æt sunde oferflat, hæfde mare mægen.', 'Þa hine on morgentid on Heaþoræmas holm up ætbær; ðonon he gesohte swæsne eþel, leof his leodum, lond Brondinga, freoðoburh fægere, þær he folc ahte burh ond beagas.', 'Beot eal wið þe sunu Beanstanes soðe gelæste.', 'Ðonne wene ic to þe wyrsan geþingea, ðeah þu heaðoræsa gehwær dohte, grimre guðe, gif þu Grendles dearst nihtlongne fyrst nean bidan.', 'Beowulf maþelode, bearn Ecgþeowes: Hwæt.', 'Þu worn fela, wine min Unferð, beore druncen ymb Brecan spræce, sægdest from his siðe.', 'Soð ic talige, þæt ic merestrengo maran ahte, earfeþo on yþum, ðonne ænig oþer man.', 'Wit þæt gecwædon cnihtwesende ond gebeotedon wæron begen þa git on geogoðfeore þæt wit on garsecg ut aldrum neðdon, ond þæt geæfndon swa.', 'Hæfdon swurd nacod, þa wit on sund reon, heard on handa; wit unc wið hronfixas werian þohton.', 'No he wiht fram me flodyþum feor fleotan meahte, hraþor on holme; no ic fram him wolde.', 'Ða wit ætsomne on sæ wæron fif nihta fyrst, oþþæt unc flod todraf, wado weallende, wedera cealdost, nipende niht, ond norþanwind heaðogrim ondhwearf; hreo wæron yþa.', 'Wæs merefixa mod onhrered; þær me wið laðum licsyrce min, heard, hondlocen, helpe gefremede, beadohrægl broden on breostum læg golde gegyrwed.', 'Me to grunde teah fah feondscaða, fæste hæfde grim on grape; hwæþre me gyfeþe wearð þæt ic aglæcan orde geræhte, hildebille; heaþoræs fornam mihtig meredeor þurh mine hand.', 'Swa mec gelome laðgeteonan þreatedon þearle.', 'Ic him þenode deoran sweorde, swa hit gedefe wæs.', 'Næs hie ðære fylle gefean hæfdon, manfordædlan, þæt hie me þegon, symbel ymbsæton sægrunde neah; ac on mergenne mecum wunde be yðlafe uppe lægon, sweordum aswefede, þæt syðþan na ymb brontne ford brimliðende lade ne letton.', 'Leoht eastan com, beorht beacen godes; brimu swaþredon, þæt ic sænæssas geseon mihte, windige weallas.', 'Wyrd oft nereð unfægne eorl, þonne his ellen deah.', 'Hwæþere me gesælde þæt ic mid sweorde ofsloh niceras nigene.', 'No ic on niht gefrægn under heofones hwealf heardran feohtan, ne on egstreamum earmran mannon; hwaþere ic fara feng feore gedigde, siþes werig.', 'Ða mec sæ oþbær, flod æfter faroðe on Finna land, wadu weallendu.', 'No ic wiht fram þe swylcra searoniða secgan hyrde, billa brogan.', 'Breca næfre git æt heaðolace, ne gehwæþer incer, swa deorlice dæd gefremede fagum sweordum no ic þæs fela gylpe, þeah ðu þinum broðrum to banan wurde, heafodmægum; þæs þu in helle scealt werhðo dreogan, þeah þin wit duge.', 'Secge ic þe to soðe, sunu Ecglafes, þæt næfre Grendel swa fela gryra gefremede, atol æglæca, ealdre þinum, hynðo on Heorote, gif þin hige wære, sefa swa searogrim, swa þu self talast.', 'Ac he hafað onfunden þæt he þa fæhðe ne þearf, atole ecgþræce eower leode swiðe onsittan, Sigescyldinga; nymeð nydbade, nænegum arað leode Deniga, ac he lust wigeð, swefeð ond sendeþ, secce ne weneþ to Gardenum.', 'Ac ic him Geata sceal eafoð ond ellen ungeara nu, guþe gebeodan.', 'Gæþ eft se þe mot to medo modig, siþþan morgenleoht ofer ylda bearn oþres dogores, sunne sweglwered suþan scineð.', 'Þa wæs on salum sinces brytta, gamolfeax ond guðrof; geoce gelyfde brego Beorhtdena, gehyrde on Beowulfe folces hyrde fæstrædne geþoht.', 'Ðær wæs hæleþa hleahtor, hlyn swynsode, word wæron wynsume.', 'Eode Wealhþeow forð, cwen Hroðgares, cynna gemyndig, grette goldhroden guman on healle, ond þa freolic wif ful gesealde ærest Eastdena eþelwearde, bæd hine bliðne æt þære beorþege, leodum leofne.', 'He on lust geþeah symbel ond seleful, sigerof kyning.', 'Ymbeode þa ides Helminga duguþe ond geogoþe dæl æghwylcne, sincfato sealde, oþþæt sæl alamp þæt hio Beowulfe, beaghroden cwen mode geþungen, medoful ætbær; grette Geata leod, gode þancode wisfæst wordum þæs ðe hire se willa gelamp þæt heo on ænigne eorl gelyfde fyrena frofre.', 'He þæt ful geþeah, wælreow wiga, æt Wealhþeon, ond þa gyddode guþe gefysed; Beowulf maþelode, bearn Ecgþeowes: Ic þæt hogode, þa ic on holm gestah, sæbat gesæt mid minre secga gedriht, þæt ic anunga eowra leoda willan geworhte oþðe on wæl crunge, feondgrapum fæst.', 'Ic gefremman sceal eorlic ellen, oþðe endedæg on þisse meoduhealle minne gebidan.', 'Ðam wife þa word wel licodon, gilpcwide Geates; eode goldhroden freolicu folccwen to hire frean sittan.', 'Þa wæs eft swa ær inne on healle þryðword sprecen, ðeod on sælum, sigefolca sweg, oþþæt semninga sunu Healfdenes secean wolde æfenræste; wiste þæm ahlæcan to þæm heahsele hilde geþinged, siððan hie sunnan leoht geseon ne meahton, oðþe nipende niht ofer ealle, scaduhelma gesceapu scriðan cwoman, wan under wolcnum.', 'Werod eall aras.', 'Gegrette þa guma oþerne, Hroðgar Beowulf, ond him hæl abead, winærnes geweald, ond þæt word acwæð: Næfre ic ænegum men ær alyfde, siþðan ic hond ond rond hebban mihte, ðryþærn Dena buton þe nu ða.', 'Hafa nu ond geheald husa selest, gemyne mærþo, mægenellen cyð, waca wið wraþum.', 'Ne bið þe wilna gad, gif þu þæt ellenweorc aldre gedigest.', 'Ða him Hroþgar gewat mid his hæleþa gedryht, eodur Scyldinga, ut of healle; wolde wigfruma Wealhþeo secan, cwen to gebeddan.', 'Hæfde kyningwuldor Grendle togeanes, swa guman gefrungon, seleweard aseted; sundornytte beheold ymb aldor Dena, eotonweard abead.', 'Huru Geata leod georne truwode modgan mægnes, metodes hyldo.', 'Ða he him of dyde isernbyrnan, helm of hafelan, sealde his hyrsted sweord, irena cyst, ombihtþegne, ond gehealdan het hildegeatwe.', 'Gespræc þa se goda gylpworda sum, Beowulf Geata, ær he on bed stige: No ic me an herewæsmun hnagran talige, guþgeweorca, þonne Grendel hine; forþan ic hine sweorde swebban nelle, aldre beneotan, þeah ic eal mæge.', 'Nat he þara goda þæt he me ongean slea, rand geheawe, þeah ðe he rof sie niþgeweorca; ac wit on niht sculon secge ofersittan, gif he gesecean dear wig ofer wæpen, ond siþðan witig god on swa hwæþere hond, halig dryhten, mærðo deme, swa him gemet þince.', 'Hylde hine þa heaþodeor, hleorbolster onfeng eorles andwlitan, ond hine ymb monig snellic særinc selereste gebeah.', 'Nænig heora þohte þæt he þanon scolde eft eardlufan æfre gesecean, folc oþðe freoburh, þær he afeded wæs; ac hie hæfdon gefrunen þæt hie ær to fela micles in þæm winsele wældeað fornam, Denigea leode.', 'Ac him dryhten forgeaf wigspeda gewiofu, Wedera leodum, frofor ond fultum, þæt hie feond heora ðurh anes cræft ealle ofercomon, selfes mihtum.', 'Soð is gecyþed þæt mihtig god manna cynnes weold wideferhð.', 'Com on wanre niht scriðan sceadugenga.', 'Sceotend swæfon, þa þæt hornreced healdan scoldon, ealle buton anum.', 'Þæt wæs yldum cuþ þæt hie ne moste, þa metod nolde, se scynscaþa under sceadu bregdan; ac he wæccende wraþum on andan bad bolgenmod beadwa geþinges.', 'Ða com of more under misthleoþum Grendel gongan, godes yrre bær; mynte se manscaða manna cynnes sumne besyrwan in sele þam hean.', 'Wod under wolcnum to þæs þe he winreced, goldsele gumena, gearwost wisse, fættum fahne.', 'Ne wæs þæt forma sið þæt he Hroþgares ham gesohte; næfre he on aldordagum ær ne siþðan heardran hæle, healðegnas fand.', 'Com þa to recede rinc siðian, dreamum bedæled.', 'Duru sona onarn, fyrbendum fæst, syþðan he hire folmum æthran; onbræd þa bealohydig, ða he gebolgen wæs, recedes muþan.', 'Raþe æfter þon on fagne flor feond treddode, eode yrremod; him of eagum stod ligge gelicost leoht unfæger.', 'Geseah he in recede rinca manige, swefan sibbegedriht samod ætgædere, magorinca heap.', 'Þa his mod ahlog; mynte þæt he gedælde, ærþon dæg cwome, atol aglæca, anra gehwylces lif wið lice, þa him alumpen wæs wistfylle wen.', 'Ne wæs þæt wyrd þa gen þæt he ma moste manna cynnes ðicgean ofer þa niht.', 'Þryðswyð beheold mæg Higelaces, hu se manscaða under færgripum gefaran wolde.', 'Ne þæt se aglæca yldan þohte, ac he gefeng hraðe forman siðe slæpendne rinc, slat unwearnum, bat banlocan, blod edrum dranc, synsnædum swealh; sona hæfde unlyfigendes eal gefeormod, fet ond folma.', 'Forð near ætstop, nam þa mid handa higeþihtigne rinc on ræste, ræhte ongean feond mid folme; he onfeng hraþe inwitþancum ond wið earm gesæt.', 'Sona þæt onfunde fyrena hyrde þæt he ne mette middangeardes, eorþan sceata, on elran men mundgripe maran.', 'He on mode wearð forht on ferhðe; no þy ær fram meahte.', 'Hyge wæs him hinfus, wolde on heolster fleon, secan deofla gedræg; ne wæs his drohtoð þær swylce he on ealderdagum ær gemette.', 'Gemunde þa se goda, mæg Higelaces, æfenspræce, uplang astod ond him fæste wiðfeng; fingras burston.', 'Eoten wæs utweard; eorl furþur stop.', 'Mynte se mæra, þær he meahte swa, widre gewindan ond on weg þanon fleon on fenhopu; wiste his fingra geweald on grames grapum.', 'Þæt wæs geocor sið þæt se hearmscaþa to Heorute ateah.', 'Dryhtsele dynede; Denum eallum wearð, ceasterbuendum, cenra gehwylcum, eorlum ealuscerwen.', 'Yrre wæron begen, reþe renweardas.', 'Reced hlynsode.', 'Þa wæs wundor micel þæt se winsele wiðhæfde heaþodeorum, þæt he on hrusan ne feol, fæger foldbold; ac he þæs fæste wæs innan ond utan irenbendum searoþoncum besmiþod.', 'Þær fram sylle abeag medubenc monig, mine gefræge, golde geregnad, þær þa graman wunnon.', 'Þæs ne wendon ær witan Scyldinga þæt hit a mid gemete manna ænig, betlic ond banfag, tobrecan meahte, listum tolucan, nymþe liges fæþm swulge on swaþule.', 'Sweg up astag niwe geneahhe; Norðdenum stod atelic egesa, anra gehwylcum þara þe of wealle wop gehyrdon, gryreleoð galan godes ondsacan, sigeleasne sang, sar wanigean helle hæfton.', 'Heold hine fæste se þe manna wæs mægene strengest on þæm dæge þysses lifes.', 'Nolde eorla hleo ænige þinga þone cwealmcuman cwicne forlætan, ne his lifdagas leoda ænigum nytte tealde.', 'Þær genehost brægd eorl Beowulfes ealde lafe, wolde freadrihtnes feorh ealgian, mæres þeodnes, ðær hie meahton swa.', 'Hie þæt ne wiston, þa hie gewin drugon, heardhicgende hildemecgas, ond on healfa gehwone heawan þohton, sawle secan, þone synscaðan ænig ofer eorþan irenna cyst, guðbilla nan, gretan nolde, ac he sigewæpnum forsworen hæfde, ecga gehwylcre.', 'Scolde his aldorgedal on ðæm dæge þysses lifes earmlic wurðan, ond se ellorgast on feonda geweald feor siðian.', 'Ða þæt onfunde se þe fela æror modes myrðe manna cynne, fyrene gefremede he wæs fag wið god, þæt him se lichoma læstan nolde, ac hine se modega mæg Hygelaces hæfde be honda; wæs gehwæþer oðrum lifigende lað.', 'Licsar gebad atol æglæca; him on eaxle wearð syndolh sweotol, seonowe onsprungon, burston banlocan.', 'Beowulfe wearð guðhreð gyfeþe; scolde Grendel þonan feorhseoc fleon under fenhleoðu, secean wynleas wic; wiste þe geornor þæt his aldres wæs ende gegongen, dogera dægrim.', 'Denum eallum wearð æfter þam wælræse willa gelumpen.', 'Hæfde þa gefælsod se þe ær feorran com, snotor ond swyðferhð, sele Hroðgares, genered wið niðe; nihtweorce gefeh, ellenmærþum.', 'Hæfde Eastdenum Geatmecga leod gilp gelæsted, swylce oncyþðe ealle gebette, inwidsorge, þe hie ær drugon ond for þreanydum þolian scoldon, torn unlytel.', 'Þæt wæs tacen sweotol, syþðan hildedeor hond alegde, earm ond eaxle þær wæs eal geador Grendles grape under geapne hrof.', 'Ða wæs on morgen mine gefræge ymb þa gifhealle guðrinc monig; ferdon folctogan feorran ond nean geond widwegas wundor sceawian, laþes lastas.', 'No his lifgedal sarlic þuhte secga ænegum þara þe tirleases trode sceawode, hu he werigmod on weg þanon, niða ofercumen, on nicera mere fæge ond geflymed feorhlastas bær.', 'Ðær wæs on blode brim weallende, atol yða geswing eal gemenged haton heolfre, heorodreore weol.', 'Deaðfæge deog, siððan dreama leas in fenfreoðo feorh alegde, hæþene sawle; þær him hel onfeng.', 'Þanon eft gewiton ealdgesiðas, swylce geong manig of gomenwaþe fram mere modge mearum ridan, beornas on blancum.', 'Ðær wæs Beowulfes mærðo mæned; monig oft gecwæð þætte suð ne norð be sæm tweonum ofer eormengrund oþer nænig under swegles begong selra nære rondhæbbendra, rices wyrðra.', 'Ne hie huru winedrihten wiht ne logon, glædne Hroðgar, ac þæt wæs god cyning.', 'Hwilum heaþorofe hleapan leton, on geflit faran fealwe mearas ðær him foldwegas fægere þuhton, cystum cuðe.', 'Hwilum cyninges þegn, guma gilphlæden, gidda gemyndig, se ðe ealfela ealdgesegena worn gemunde, word oþer fand soðe gebunden; secg eft ongan sið Beowulfes snyttrum styrian ond on sped wrecan spel gerade, wordum wrixlan.', 'Welhwylc gecwæð þæt he fram Sigemundes secgan hyrde ellendædum, uncuþes fela, Wælsinges gewin, wide siðas, þara þe gumena bearn gearwe ne wiston, fæhðe ond fyrena, buton Fitela mid hine, þonne he swulces hwæt secgan wolde, eam his nefan, swa hie a wæron æt niða gehwam nydgesteallan; hæfdon ealfela eotena cynnes sweordum gesæged.', 'Sigemunde gesprong æfter deaðdæge dom unlytel, syþðan wiges heard wyrm acwealde, hordes hyrde.', 'He under harne stan, æþelinges bearn, ana geneðde frecne dæde, ne wæs him Fitela mid.', 'hwæþre him gesælde ðæt þæt swurd þurhwod wrætlicne wyrm, þæt hit on wealle ætstod, dryhtlic iren; draca morðre swealt.', 'Hæfde aglæca elne gegongen þæt he beahhordes brucan moste selfes dome; sæbat gehleod, bær on bearm scipes beorhte frætwa, Wælses eafera.', 'Wyrm hat gemealt.', 'Se wæs wreccena wide mærost ofer werþeode, wigendra hleo, ellendædum he þæs ær onðah, siððan Heremodes hild sweðrode, eafoð ond ellen.', 'He mid Eotenum wearð on feonda geweald forð forlacen, snude forsended.', 'Hine sorhwylmas lemede to lange; he his leodum wearð, eallum æþellingum to aldorceare; swylce oft bemearn ærran mælum swiðferhþes sið snotor ceorl monig, se þe him bealwa to bote gelyfde, þæt þæt ðeodnes bearn geþeon scolde, fæderæþelum onfon, folc gehealdan, hord ond hleoburh, hæleþa rice, eþel Scyldinga.', 'He þær eallum wearð, mæg Higelaces, manna cynne, freondum gefægra; hine fyren onwod.', 'Hwilum flitende fealwe stræte mearum mæton.', 'Ða wæs morgenleoht scofen ond scynded.', 'Eode scealc monig swiðhicgende to sele þam hean searowundor seon; swylce self cyning of brydbure, beahhorda weard, tryddode tirfæst getrume micle, cystum gecyþed, ond his cwen mid him medostigge mæt mægþa hose.', 'Hroðgar maþelode he to healle geong, stod on stapole, geseah steapne hrof, golde fahne, ond Grendles hond: ðisse ansyne alwealdan þanc lungre gelimpe.', 'Fela ic laþes gebad, grynna æt Grendle; a mæg god wyrcan wunder æfter wundre, wuldres hyrde.', 'Ðæt wæs ungeara þæt ic ænigra me weana ne wende to widan feore bote gebidan, þonne blode fah husa selest heorodreorig stod, wea widscofen witena gehwylcum ðara þe ne wendon þæt hie wideferhð leoda landgeweorc laþum beweredon scuccum ond scinnum.', 'Nu scealc hafað þurh drihtnes miht dæd gefremede ðe we ealle ær ne meahton snyttrum besyrwan.', 'Hwæt, þæt secgan mæg efne swa hwylc mægþa swa ðone magan cende æfter gumcynnum, gyf heo gyt lyfað, þæt hyre ealdmetod este wære bearngebyrdo.', 'Nu ic, Beowulf, þec, secg betsta, me for sunu wylle freogan on ferhþe; heald forð tela niwe sibbe.', 'Ne bið þe nænigra gad worolde wilna, þe ic geweald hæbbe.', 'Ful oft ic for læssan lean teohhode, hordweorþunge hnahran rince, sæmran æt sæcce.', 'Þu þe self hafast dædum gefremed þæt þin dom lyfað awa to aldre.', 'Alwalda þec gode forgylde, swa he nu gyt dyde.', 'Beowulf maþelode, bearn Ecþeowes: We þæt ellenweorc estum miclum, feohtan fremedon, frecne geneðdon eafoð uncuþes.', 'Uþe ic swiþor þæt ðu hine selfne geseon moste, feond on frætewum fylwerigne.', 'Ic hine hrædlice heardan clammum on wælbedde wriþan þohte, þæt he for mundgripe minum scolde licgean lifbysig, butan his lic swice.', 'Ic hine ne mihte, þa metod nolde, ganges getwæman, no ic him þæs georne ætfealh, feorhgeniðlan; wæs to foremihtig feond on feþe.', 'Hwæþere he his folme forlet to lifwraþe last weardian, earm ond eaxle.', 'No þær ænige swa þeah feasceaft guma frofre gebohte; no þy leng leofað laðgeteona, synnum geswenced, ac hyne sar hafað mid nydgripe nearwe befongen, balwon bendum.', 'Ðær abidan sceal maga mane fah miclan domes, hu him scir metod scrifan wille.', 'Ða wæs swigra secg, sunu Eclafes, on gylpspræce guðgeweorca, siþðan æþelingas eorles cræfte ofer heanne hrof hand sceawedon, feondes fingras.', 'Foran æghwylc wæs, stiðra nægla gehwylc, style gelicost, hæþenes handsporu hilderinces, egl, unheoru.', 'Æghwylc gecwæð þæt him heardra nan hrinan wolde iren ærgod, þæt ðæs ahlæcan blodge beadufolme onberan wolde.', 'Ða wæs haten hreþe Heort innanweard folmum gefrætwod.', 'Fela þæra wæs, wera ond wifa, þe þæt winreced, gestsele gyredon.', 'Goldfag scinon web æfter wagum, wundorsiona fela secga gehwylcum þara þe on swylc starað.', 'Wæs þæt beorhte bold tobrocen swiðe, eal inneweard irenbendum fæst, heorras tohlidene.', 'Hrof ana genæs, ealles ansund, þe se aglæca, fyrendædum fag, on fleam gewand, aldres orwena.', 'No þæt yðe byð to befleonne, fremme se þe wille, ac gesecan sceal sawlberendra, nyde genydde, niþða bearna, grundbuendra gearwe stowe, þær his lichoma legerbedde fæst swefeþ æfter symle.', 'Þa wæs sæl ond mæl þæt to healle gang Healfdenes sunu; wolde self cyning symbel þicgan.', 'Ne gefrægen ic þa mægþe maran weorode ymb hyra sincgyfan sel gebæran.', 'Bugon þa to bence blædagande, fylle gefægon; fægere geþægon medoful manig magas þara swiðhicgende on sele þam hean, Hroðgar ond Hroþulf.', 'Heorot innan wæs freondum afylled; nalles facenstafas |eodscyldingas þenden fremedon.', 'Forgeaf þa Beowulfe bearn Healfdenes segen gyldenne sigores to leane; hroden hildecumbor, helm ond byrnan, mære maðþumsweord manige gesawon beforan beorn beran.', 'Beowulf geþah ful on flette; no he þære feohgyfte for sceotendum scamigan ðorfte.', 'Ne gefrægn ic freondlicor feower madmas golde gegyrede gummanna fela in ealobence oðrum gesellan.', 'Ymb þæs helmes hrof heafodbeorge wirum bewunden walu utan heold, þæt him fela laf frecne ne meahton scurheard sceþðan, þonne scyldfreca ongean gramum gangan scolde.', 'Heht ða eorla hleo eahta mearas fætedhleore on flet teon, in under eoderas.', 'Þara anum stod sadol searwum fah, since gewurþad; þæt wæs hildesetl heahcyninges, ðonne sweorda gelac sunu Healfdenes efnan wolde.', 'Næfre on ore læg widcuþes wig, ðonne walu feollon.', 'Ond ða Beowulfe bega gehwæþres eodor Ingwina onweald geteah, wicga ond wæpna, het hine wel brucan.', 'Swa manlice mære þeoden, hordweard hæleþa, heaþoræsas geald mearum ond madmum, swa hy næfre man lyhð, se þe secgan wile soð æfter rihte.', 'Ða gyt æghwylcum eorla drihten þara þe mid Beowulfe brimlade teah on þære medubence maþðum gesealde, yrfelafe, ond þone ænne heht golde forgyldan, þone ðe Grendel ær mane acwealde, swa he hyra ma wolde, nefne him witig god wyrd forstode ond ðæs mannes mod.', 'Metod eallum weold gumena cynnes, swa he nu git deð.', 'Forþan bið andgit æghwær selest, ferhðes foreþanc.', 'Fela sceal gebidan leofes ond laþes se þe longe her on ðyssum windagum worolde bruceð.', 'Þær wæs sang ond sweg samod ætgædere fore Healfdenes hildewisan, gomenwudu greted, gid oft wrecen, ðonne healgamen Hroþgares scop æfter medobence mænan scolde be Finnes eaferum, ða hie se fær begeat, hæleð Healfdena, Hnæf Scyldinga, in Freswæle feallan scolde.', 'Ne huru Hildeburh herian þorfte Eotena treowe; unsynnum wearð beloren leofum æt þam lindplegan, bearnum ond broðrum; hie on gebyrd hruron, gare wunde.', 'Þæt wæs geomuru ides.', 'Nalles holinga Hoces dohtor meotodsceaft bemearn, syþðan morgen com, ða heo under swegle geseon meahte morþorbealo maga, þær heo ær mæste heold worolde wynne.', 'Wig ealle fornam Finnes þegnas nemne feaum anum, þæt he ne mehte on þæm meðelstede wig Hengeste wiht gefeohtan, ne þa wealafe wige forþringan þeodnes ðegna.', 'ac hig him geþingo budon, þæt hie him oðer flet eal gerymdon, healle ond heahsetl, þæt hie healfre geweald wið Eotena bearn agan moston, ond æt feohgyftum Folcwaldan sunu dogra gehwylce Dene weorþode, Hengestes heap hringum wenede efne swa swiðe sincgestreonum fættan goldes, swa he Fresena cyn on beorsele byldan wolde.', 'Ða hie getruwedon on twa healfa fæste frioðuwære.', 'Fin Hengeste elne, unflitme aðum benemde þæt he þa wealafe weotena dome arum heolde, þæt ðær ænig mon wordum ne worcum wære ne bræce, ne þurh inwitsearo æfre gemænden ðeah hie hira beaggyfan banan folgedon ðeodenlease, þa him swa geþearfod wæs.', 'gyf þonne Frysna hwylc frecnan spræce ðæs morþorhetes myndgiend wære, þonne hit sweordes ecg seðan scolde.', 'Ad wæs geæfned ond icge gold ahæfen of horde.', 'Herescyldinga betst beadorinca wæs on bæl gearu.', 'Æt þæm ade wæs eþgesyne swatfah syrce, swyn ealgylden, eofer irenheard, æþeling manig wundum awyrded; sume on wæle crungon.', 'Het ða Hildeburh æt Hnæfes ade hire selfre sunu sweoloðe befæstan, banfatu bærnan ond on bæl don eame on eaxle.', 'Ides gnornode, geomrode giddum.', 'Guðrinc astah.', 'Wand to wolcnum wælfyra mæst, hlynode for hlawe; hafelan multon, bengeato burston, ðonne blod ætspranc, laðbite lices.', 'Lig ealle forswealg, gæsta gifrost, þara ðe þær guð fornam bega folces; wæs hira blæd scacen.', 'Gewiton him ða wigend wica neosian, freondum befeallen, Frysland geseon, hamas ond heaburh.', 'Hengest ða gyt wælfagne winter wunode mid Finne eal unhlitme.', 'Eard gemunde, þeah þe he ne meahte on mere drifan hringedstefnan; holm storme weol, won wið winde, winter yþe beleac isgebinde, oþðæt oþer com gear in geardas, swa nu gyt deð, þa ðe syngales sele bewitiað, wuldortorhtan weder.', 'Ða wæs winter scacen, fæger foldan bearm.', 'Fundode wrecca, gist of geardum; he to gyrnwræce swiðor þohte þonne to sælade, gif he torngemot þurhteon mihte þæt he Eotena bearn inne gemunde.', 'Swa he ne forwyrnde woroldrædenne, þonne him Hunlafing hildeleoman, billa selest, on bearm dyde, þæs wæron mid Eotenum ecge cuðe.', 'Swylce ferhðfrecan Fin eft begeat sweordbealo sliðen æt his selfes ham, siþðan grimne gripe Guðlaf ond Oslaf æfter sæsiðe, sorge, mændon, ætwiton weana dæl; ne meahte wæfre mod forhabban in hreþre.', 'Ða wæs heal roden feonda feorum, swilce Fin slægen, cyning on corþre, ond seo cwen numen.', 'Sceotend Scyldinga to scypon feredon eal ingesteald eorðcyninges, swylce hie æt Finnes ham findan meahton sigla, searogimma.', 'Hie on sælade drihtlice wif to Denum feredon, læddon to leodum.', 'Leoð wæs asungen, gleomannes gyd.', 'Gamen eft astah, beorhtode bencsweg; byrelas sealdon win of wunderfatum.', 'Þa cwom Wealhþeo forð gan under gyldnum beage, þær þa godan twegen sæton suhtergefæderan; þa gyt wæs hiera sib ætgædere, æghwylc oðrum trywe.', 'Swylce þær Unferþ þyle æt fotum sæt frean Scyldinga; gehwylc hiora his ferhþe treowde, þæt he hæfde mod micel, þeah þe he his magum nære arfæst æt ecga gelacum.', 'Spræc ða ides Scyldinga: Onfoh þissum fulle, freodrihten min, sinces brytta.', 'Þu on sælum wes, goldwine gumena, ond to Geatum spræc mildum wordum, swa sceal man don.', 'Beo wið Geatas glæd, geofena gemyndig, nean ond feorran þu nu hafast.', 'Me man sægde þæt þu ðe for sunu wolde hererinc habban.', 'Heorot is gefælsod, beahsele beorhta; bruc þenden þu mote manigra medo, ond þinum magum læf folc ond rice, þonne ðu forð scyle metodsceaft seon.', 'Ic minne can glædne Hroþulf, þæt he þa geogoðe wile arum healdan, gyf þu ær þonne he, wine Scildinga, worold oflætest; wene ic þæt he mid gode gyldan wille uncran eaferan, gif he þæt eal gemon, hwæt wit to willan ond to worðmyndum umborwesendum ær arna gefremedon.', 'Hwearf þa bi bence þær hyre byre wæron, Hreðric ond Hroðmund, ond hæleþa bearn, giogoð ætgædere; þær se goda sæt, Beowulf Geata, be þæm gebroðrum twæm.', 'Him wæs ful boren ond freondlaþu wordum bewægned, ond wunden gold estum geeawed, earmreade twa, hrægl ond hringas, healsbeaga mæst þara þe ic on foldan gefrægen hæbbe.', 'Nænigne ic under swegle selran hyrde hordmaððum hæleþa, syþðan Hama ætwæg to þære byrhtan byrig Brosinga mene, sigle ond sincfæt; searoniðas fleah Eormenrices, geceas ecne ræd.', 'Þone hring hæfde Higelac Geata, nefa Swertinges, nyhstan siðe, siðþan he under segne sinc ealgode, wælreaf werede; hyne wyrd fornam, syþðan he for wlenco wean ahsode, fæhðe to Frysum.', 'He þa frætwe wæg, eorclanstanas ofer yða ful, rice þeoden; he under rande gecranc.', 'Gehwearf þa in Francna fæþm feorh cyninges, breostgewædu ond se beah somod; wyrsan wigfrecan wæl reafedon æfter guðsceare, Geata leode, hreawic heoldon.', 'Heal swege onfeng.', 'Wealhðeo maþelode, heo fore þæm werede spræc: Bruc ðisses beages, Beowulf leofa, hyse, mid hæle, ond þisses hrægles neot, þeodgestreona, ond geþeoh tela, cen þec mid cræfte ond þyssum cnyhtum wes lara liðe; ic þe þæs lean geman.', 'Hafast þu gefered þæt ðe feor ond neah ealne wideferhþ weras ehtigað, efne swa side swa sæ bebugeð, windgeard, weallas.', 'Wes þenden þu lifige, æþeling, eadig.', 'Ic þe an tela sincgestreona.', 'Beo þu suna minum dædum gedefe, dreamhealdende.', 'Her is æghwylc eorl oþrum getrywe, modes milde, mandrihtne hold; þegnas syndon geþwære, þeod ealgearo, druncne dryhtguman doð swa ic bidde.', 'Eode þa to setle.', 'Þær wæs symbla cyst; druncon win weras.', 'Wyrd ne cuþon, geosceaft grimme, swa hit agangen wearð eorla manegum, syþðan æfen cwom ond him Hroþgar gewat to hofe sinum, rice to ræste.', 'Reced weardode unrim eorla, swa hie oft ær dydon.', 'Bencþelu beredon; hit geondbræded wearð beddum ond bolstrum.', 'Beorscealca sum fus ond fæge fletræste gebeag.', 'Setton him to heafdon hilderandas, bordwudu beorhtan; þær on bence wæs ofer æþelinge yþgesene heaþosteapa helm, hringed byrne, þrecwudu þrymlic.', 'Wæs þeaw hyra þæt hie oft wæron an wig gearwe, ge æt ham ge on herge, ge gehwæþer þara, efne swylce mæla swylce hira mandryhtne þearf gesælde; wæs seo þeod tilu.', 'Sigon þa to slæpe.', 'Sum sare angeald æfenræste, swa him ful oft gelamp, siþðan goldsele Grendel warode, unriht æfnde, oþþæt ende becwom, swylt æfter synnum.', 'Þæt gesyne wearþ, widcuþ werum, þætte wrecend þa gyt lifde æfter laþum, lange þrage, æfter guðceare.', 'Grendles modor, ides, aglæcwif, yrmþe gemunde, se þe wæteregesan wunian scolde, cealde streamas, siþðan Cain wearð to ecgbanan angan breþer, fæderenmæge; he þa fag gewat, morþre gemearcod, mandream fleon, westen warode.', 'Þanon woc fela geosceaftgasta; wæs þæra Grendel sum, heorowearh hetelic, se æt Heorote fand wæccendne wer wiges bidan.', 'Þær him aglæca ætgræpe wearð; hwæþre he gemunde mægenes strenge, gimfæste gife ðe him god sealde, ond him to anwaldan are gelyfde, frofre ond fultum; ðy he þone feond ofercwom, gehnægde helle gast.', 'Þa he hean gewat, dreame bedæled, deaþwic seon, mancynnes feond, ond his modor þa gyt, gifre ond galgmod, gegan wolde sorhfulne sið, sunu deað wrecan.', 'Com þa to Heorote, ðær Hringdene geond þæt sæld swæfun.', 'Þa ðær sona wearð edhwyrft eorlum, siþðan inne fealh Grendles modor.', 'Wæs se gryre læssa efne swa micle swa bið mægþa cræft, wiggryre wifes, be wæpnedmen, þonne heoru bunden, hamere geþuren, sweord swate fah swin ofer helme ecgum dyhttig andweard scireð.', 'Þa wæs on healle heardecg togen sweord ofer setlum, sidrand manig hafen handa fæst; helm ne gemunde, byrnan side, þa hine se broga angeat.', 'Heo wæs on ofste, wolde ut þanon, feore beorgan, þa heo onfunden wæs.', 'Hraðe heo æþelinga anne hæfde fæste befangen, þa heo to fenne gang.', 'Se wæs Hroþgare hæleþa leofost on gesiðes had be sæm tweonum, rice randwiga, þone ðe heo on ræste abreat, blædfæstne beorn.', 'Næs Beowulf ðær, ac wæs oþer in ær geteohhod æfter maþðumgife mærum Geate.', 'Hream wearð in Heorote; heo under heolfre genam cuþe folme; cearu wæs geniwod, geworden in wicun.', 'Ne wæs þæt gewrixle til, þæt hie on ba healfa bicgan scoldon freonda feorum.', 'Þa wæs frod cyning, har hilderinc, on hreon mode, syðþan he aldorþegn unlyfigendne, þone deorestan deadne wisse.', 'Hraþe wæs to bure Beowulf fetod, sigoreadig secg.', 'Samod ærdæge eode eorla sum, æþele cempa self mid gesiðum þær se snotera bad, hwæþer him alwalda æfre wille æfter weaspelle wyrpe gefremman.', 'Gang ða æfter flore fyrdwyrðe man mid his handscale healwudu dynede, þæt he þone wisan wordum nægde frean Ingwina, frægn gif him wære æfter neodlaðum niht getæse.', 'Hroðgar maþelode, helm Scyldinga: Ne frin þu æfter sælum.', 'Sorh is geniwod Denigea leodum.', 'Dead is æschere, Yrmenlafes yldra broþor, min runwita ond min rædbora, eaxlgestealla, ðonne we on orlege hafelan weredon, þonne hniton feþan, eoferas cynsedan.', 'Swylc scolde eorl wesan, æþeling ærgod, swylc æschere wæs.', 'Wearð him on Heorote to handbanan wælgæst wæfre; ic ne wat hwæder atol æse wlanc eftsiðas teah, fylle gefægnod.', 'Heo þa fæhðe wræc þe þu gystranniht Grendel cwealdest þurh hæstne had heardum clammum, forþan he to lange leode mine wanode ond wyrde.', 'He æt wige gecrang ealdres scyldig, ond nu oþer cwom mihtig manscaða, wolde hyre mæg wrecan, ge feor hafað fæhðe gestæled (þæs þe þincean mæg þegne monegum, se þe æfter sincgyfan on sefan greoteþ), hreþerbealo hearde; nu seo hand ligeð, se þe eow welhwylcra wilna dohte.', 'Ic þæt londbuend, leode mine, selerædende, secgan hyrde þæt hie gesawon swylce twegen micle mearcstapan moras healdan, ellorgæstas.', 'Ðæra oðer wæs, þæs þe hie gewislicost gewitan meahton, idese onlicnæs; oðer earmsceapen on weres wæstmum wræclastas træd, næfne he wæs mara þonne ænig man oðer; þone on geardagum Grendel nemdon foldbuende.', 'No hie fæder cunnon, hwæþer him ænig wæs ær acenned dyrnra gasta.', 'Hie dygel lond warigeað, wulfhleoþu, windige næssas, frecne fengelad, ðær fyrgenstream under næssa genipu niþer gewiteð, flod under foldan.', 'Nis þæt feor heonon milgemearces þæt se mere standeð; ofer þæm hongiað hrinde bearwas, wudu wyrtum fæst wæter oferhelmað.', 'Þær mæg nihta gehwæm niðwundor seon, fyr on flode.', 'No þæs frod leofað gumena bearna, þæt þone grund wite; ðeah þe hæðstapa hundum geswenced, heorot hornum trum, holtwudu sece, feorran geflymed, ær he feorh seleð, aldor on ofre, ær he in wille hafelan hydan.', 'Nis þæt heoru stow! þonon yðgeblond up astigeð won to wolcnum, þonne wind styreþ, lað gewidru, oðþæt lyft drysmaþ, roderas reotað.', 'Nu is se ræd gelang eft æt þe anum.', 'Eard git ne const, frecne stowe, ðær þu findan miht felasinnigne secg; sec gif þu dyrre.', 'Ic þe þa fæhðe feo leanige, ealdgestreonum, swa ic ær dyde, wundnum golde, gyf þu on weg cymest.\" Beowulf maþelode, bearn Ecgþeowes: \"Ne sorga, snotor guma; selre bið æghwæm þæt he his freond wrece, þonne he fela murne.', 'Ure æghwylc sceal ende gebidan worolde lifes; wyrce se þe mote domes ær deaþe; þæt bið drihtguman unlifgendum æfter selest.', 'Aris, rices weard, uton raþe feran Grendles magan gang sceawigan.', 'Ic hit þe gehate, no he on helm losaþ, ne on foldan fæþm, ne on fyrgenholt, ne on gyfenes grund, ga þær he wille.', 'Ðys dogor þu geþyld hafa weana gehwylces, swa ic þe wene to.\" Ahleop ða se gomela, gode þancode, mihtigan drihtne, þæs se man gespræc.', 'Þa wæs Hroðgare hors gebæted, wicg wundenfeax.', 'Wisa fengel geatolic gende; gumfeþa stop lindhæbbendra.', 'Lastas wæron æfter waldswaþum wide gesyne, gang ofer grundas, þær heo gegnum for ofer myrcan mor, magoþegna bær þone selestan sawolleasne þara þe mid Hroðgare ham eahtode.', 'Ofereode þa æþelinga bearn steap stanhliðo, stige nearwe, enge anpaðas, uncuð gelad, neowle næssas, nicorhusa fela.', 'He feara sum beforan gengde wisra monna wong sceawian, oþþæt he færinga fyrgenbeamas ofer harne stan hleonian funde, wynleasne wudu; wæter under stod dreorig ond gedrefed.', 'Denum eallum wæs, winum Scyldinga, weorce on mode to geþolianne, ðegne monegum, oncyð eorla gehwæm, syðþan æscheres on þam holmclife hafelan metton.', 'Flod blode weol (folc to sægon), hatan heolfre.', 'Horn stundum song fuslic fyrdleoð.', 'Feþa eal gesæt.', 'Gesawon ða æfter wætere wyrmcynnes fela, sellice sædracan, sund cunnian, swylce on næshleoðum nicras licgean, ða on undernmæl oft bewitigað sorhfulne sið on seglrade, wyrmas ond wildeor; hie on weg hruron, bitere ond gebolgne, bearhtm ongeaton, guðhorn galan.', 'Sumne Geata leod of flanbogan feores getwæfde, yðgewinnes, þæt him on aldre stod herestræl hearda; he on holme wæs sundes þe sænra, ðe hyne swylt fornam.', 'Hræþe wearð on yðum mid eoferspreotum heorohocyhtum hearde genearwod, niða genæged, ond on næs togen, wundorlic wægbora; weras sceawedon gryrelicne gist.', 'Gyrede hine Beowulf eorlgewædum, nalles for ealdre mearn.', 'Scolde herebyrne hondum gebroden, sid ond searofah, sund cunnian, seo ðe bancofan beorgan cuþe, þæt him hildegrap hreþre ne mihte, eorres inwitfeng, aldre gesceþðan; ac se hwita helm hafelan werede, se þe meregrundas mengan scolde, secan sundgebland since geweorðad, befongen freawrasnum, swa hine fyrndagum worhte wæpna smið, wundrum teode, besette swinlicum, þæt hine syðþan no brond ne beadomecas bitan ne meahton.', 'Næs þæt þonne mætost mægenfultuma þæt him on ðearfe lah ðyle Hroðgares; wæs þæm hæftmece Hrunting nama.', 'Þæt wæs an foran ealdgestreona; ecg wæs iren, atertanum fah, ahyrded heaþoswate; næfre hit æt hilde ne swac manna ængum þara þe hit mid mundum bewand, se ðe gryresiðas gegan dorste, folcstede fara; næs þæt forma sið þæt hit ellenweorc æfnan scolde.', 'Huru ne gemunde mago Ecglafes, eafoþes cræftig, þæt he ær gespræc wine druncen, þa he þæs wæpnes onlah selran sweordfrecan.', 'Selfa ne dorste under yða gewin aldre geneþan, drihtscype dreogan; þær he dome forleas, ellenmærðum.', 'Ne wæs þæm oðrum swa, syðþan he hine to guðe gegyred hæfde.', 'Beowulf maðelode, bearn Ecgþeowes: \"Geþenc nu, se mæra maga Healfdenes, snottra fengel, nu ic eom siðes fus, goldwine gumena, hwæt wit geo spræcon, gif ic æt þearfe þinre scolde aldre linnan, þæt ðu me a wære forðgewitenum on fæder stæle.', 'Wes þu mundbora minum magoþegnum, hondgesellum, gif mec hild nime; swylce þu ða madmas þe þu me sealdest, Hroðgar leofa, Higelace onsend.', 'Mæg þonne on þæm golde ongitan Geata dryhten, geseon sunu Hrædles, þonne he on þæt sinc starað, þæt ic gumcystum godne funde beaga bryttan, breac þonne moste.', 'Ond þu Unferð læt ealde lafe, wrætlic wægsweord, widcuðne man heardecg habban; ic me mid Hruntinge dom gewyrce, oþðe mec deað nimeð.\" æfter þæm wordum Wedergeata leod efste mid elne, nalas ondsware bidan wolde; brimwylm onfeng hilderince.', 'Ða wæs hwil dæges ær he þone grundwong ongytan mehte.', 'Sona þæt onfunde se ðe floda begong heorogifre beheold hund missera, grim ond grædig, þæt þær gumena sum ælwihta eard ufan cunnode.', 'Grap þa togeanes, guðrinc gefeng atolan clommum.', 'No þy ær in gescod halan lice; hring utan ymbbearh, þæt heo þone fyrdhom ðurhfon ne mihte, locene leoðosyrcan laþan fingrum.', 'Bær þa seo brimwylf, þa heo to botme com, hringa þengel to hofe sinum, swa he ne mihte, no he þæs modig wæs, wæpna gewealdan, ac hine wundra þæs fela swencte on sunde, sædeor monig hildetuxum heresyrcan bræc, ehton aglæcan.', 'Ða se eorl ongeat þæt he in niðsele nathwylcum wæs, þær him nænig wæter wihte ne sceþede, ne him for hrofsele hrinan ne mehte færgripe flodes; fyrleoht geseah, blacne leoman, beorhte scinan.', 'Ongeat þa se goda grundwyrgenne, merewif mihtig; mægenræs forgeaf hildebille, hond sweng ne ofteah, þæt hire on hafelan hringmæl agol grædig guðleoð.', 'Ða se gist onfand þæt se beadoleoma bitan nolde, aldre sceþðan, ac seo ecg geswac ðeodne æt þearfe; ðolode ær fela hondgemota, helm oft gescær, fæges fyrdhrægl; ða wæs forma sið deorum madme, þæt his dom alæg.', 'Eft wæs anræd, nalas elnes læt, mærða gemyndig mæg Hylaces.', 'Wearp ða wundenmæl wrættum gebunden yrre oretta, þæt hit on eorðan læg, stið ond stylecg; strenge getruwode, mundgripe mægenes.', 'Swa sceal man don, þonne he æt guðe gegan þenceð longsumne lof, na ymb his lif cearað.', 'Gefeng þa be eaxle (nalas for fæhðe mearn) Guðgeata leod Grendles modor; brægd þa beadwe heard, þa he gebolgen wæs, feorhgeniðlan, þæt heo on flet gebeah.', 'Heo him eft hraþe andlean forgeald grimman grapum ond him togeanes feng; oferwearp þa werigmod wigena strengest, feþecempa, þæt he on fylle wearð.', 'Ofsæt þa þone selegyst ond hyre seax geteah, brad ond brunecg, wolde hire bearn wrecan, angan eaferan.', 'Him on eaxle læg breostnet broden; þæt gebearh feore, wið ord ond wið ecge ingang forstod.', 'Hæfde ða forsiðod sunu Ecgþeowes under gynne grund, Geata cempa, nemne him heaðobyrne helpe gefremede, herenet hearde, ond halig god geweold wigsigor; witig drihten, rodera rædend, hit on ryht gesced yðelice, syþðan he eft astod.', 'Geseah ða on searwum sigeeadig bil, eald sweord eotenisc, ecgum þyhtig, wigena weorðmynd; þæt wæs wæpna cyst, buton hit wæs mare ðonne ænig mon oðer to beadulace ætberan meahte, god ond geatolic, giganta geweorc.', 'He gefeng þa fetelhilt, freca Scyldinga hreoh ond heorogrim hringmæl gebrægd, aldres orwena, yrringa sloh, þæt hire wið halse heard grapode, banhringas bræc.', 'Bil eal ðurhwod fægne flæschoman; heo on flet gecrong.', 'Sweord wæs swatig, secg weorce gefeh.', 'Lixte se leoma, leoht inne stod, efne swa of hefene hadre scineð rodores candel.', 'He æfter recede wlat; hwearf þa be wealle, wæpen hafenade heard be hiltum Higelaces ðegn, yrre ond anræd.', 'Næs seo ecg fracod hilderince, ac he hraþe wolde Grendle forgyldan guðræsa fela ðara þe he geworhte to Westdenum oftor micle ðonne on ænne sið, þonne he Hroðgares heorðgeneatas sloh on sweofote, slæpende fræt folces Denigea fyftyne men ond oðer swylc ut offerede, laðlicu lac.', 'He him þæs lean forgeald, reþe cempa, to ðæs þe he on ræste geseah guðwerigne Grendel licgan aldorleasne, swa him ær gescod hild æt Heorote.', 'Hra wide sprong, syþðan he æfter deaðe drepe þrowade, heorosweng heardne, ond hine þa heafde becearf.', 'Sona þæt gesawon snottre ceorlas, þa ðe mid Hroðgare on holm wliton, þæt wæs yðgeblond eal gemenged, brim blode fah.', 'Blondenfeaxe, gomele ymb godne, ongeador spræcon þæt hig þæs æðelinges eft ne wendon þæt he sigehreðig secean come mærne þeoden; þa ðæs monige gewearð þæt hine seo brimwylf abroten hæfde.', 'Ða com non dæges.', 'Næs ofgeafon hwate Scyldingas; gewat him ham þonon goldwine gumena.', 'Gistas setan modes seoce ond on mere staredon, wiston ond ne wendon þæt hie heora winedrihten selfne gesawon.', 'Þa þæt sweord ongan æfter heaþoswate hildegicelum, wigbil wanian.', 'Þæt wæs wundra sum, þæt hit eal gemealt ise gelicost, ðonne forstes bend fæder onlæteð, onwindeð wælrapas, se geweald hafað sæla ond mæla; þæt is soð metod.', 'Ne nom he in þæm wicum, Wedergeata leod, maðmæhta ma, þeh he þær monige geseah, buton þone hafelan ond þa hilt somod since fage.', 'Sweord ær gemealt, forbarn brodenmæl; wæs þæt blod to þæs hat, ættren ellorgæst se þær inne swealt.', 'Sona wæs on sunde se þe ær æt sæcce gebad wighryre wraðra, wæter up þurhdeaf.', 'Wæron yðgebland eal gefælsod, eacne eardas, þa se ellorgast oflet lifdagas ond þas lænan gesceaft.', 'Com þa to lande lidmanna helm swiðmod swymman; sælace gefeah, mægenbyrþenne þara þe he him mid hæfde.', 'Eodon him þa togeanes, gode þancodon, ðryðlic þegna heap, þeodnes gefegon, þæs þe hi hyne gesundne geseon moston.', 'Ða wæs of þæm hroran helm ond byrne lungre alysed.', 'Lagu drusade, wæter under wolcnum, wældreore fag.', 'Ferdon forð þonon feþelastum ferhþum fægne, foldweg mæton, cuþe stræte.', 'Cyningbalde men from þæm holmclife hafelan bæron earfoðlice heora æghwæþrum, felamodigra; feower scoldon on þæm wælstenge weorcum geferian to þæm goldsele Grendles heafod, oþðæt semninga to sele comon frome fyrdhwate feowertyne Geata gongan; gumdryhten mid modig on gemonge meodowongas træd.', 'Ða com in gan ealdor ðegna, dædcene mon dome gewurþad, hæle hildedeor, Hroðgar gretan.', 'Þa wæs be feaxe on flet boren Grendles heafod, þær guman druncon, egeslic for eorlum ond þære idese mid, wliteseon wrætlic; weras on sawon.', 'Beowulf maþelode, bearn Ecgþeowes: \"Hwæt! we þe þas sælac, sunu Healfdenes, leod Scyldinga, lustum brohton tires to tacne, þe þu her to locast.', 'Ic þæt unsofte ealdre gedigde wigge under wætere, weorc geneþde earfoðlice; ætrihte wæs guð getwæfed, nymðe mec god scylde.', 'Ne meahte ic æt hilde mid Hruntinge wiht gewyrcan, þeah þæt wæpen duge; ac me geuðe ylda waldend þæt ic on wage geseah wlitig hangian eald sweord eacen (oftost wisode winigea leasum), þæt ic ðy wæpne gebræd.', 'Ofsloh ða æt þære sæcce, þa me sæl ageald, huses hyrdas.', 'Þa þæt hildebil forbarn brogdenmæl, swa þæt blod gesprang, hatost heaþoswata.', 'Ic þæt hilt þanan feondum ætferede, fyrendæda wræc, deaðcwealm Denigea, swa hit gedefe wæs.', 'Ic hit þe þonne gehate, þæt þu on Heorote most sorhleas swefan mid þinra secga gedryht ond þegna gehwylc þinra leoda, duguðe ond iogoþe, þæt þu him ondrædan ne þearft, þeoden Scyldinga, on þa healfe, aldorbealu eorlum, swa þu ær dydest.\" ða wæs gylden hilt gamelum rince, harum hildfruman, on hand gyfen, enta ærgeweorc; hit on æht gehwearf æfter deofla hryre Denigea frean, wundorsmiþa geweorc, ond þa þas worold ofgeaf gromheort guma, godes ondsaca, morðres scyldig, ond his modor eac, on geweald gehwearf woroldcyninga ðæm selestan be sæm tweonum ðara þe on Scedenigge sceattas dælde.', 'Hroðgar maðelode, hylt sceawode, ealde lafe, on ðæm wæs or writen fyrngewinnes, syðþan flod ofsloh, gifen geotende, giganta cyn (frecne geferdon); þæt wæs fremde þeod ecean dryhtne; him þæs endelean þurh wæteres wylm waldend sealde.', 'Swa wæs on ðæm scennum sciran goldes þurh runstafas rihte gemearcod, geseted ond gesæd hwam þæt sweord geworht, irena cyst, ærest wære, wreoþenhilt ond wyrmfah.', 'Ða se wisa spræc sunu Healfdenes (swigedon ealle): \"þæt, la, mæg secgan se þe soð ond riht fremeð on folce, feor eal gemon, eald OEweard, þæt ðes eorl wære geboren betera! Blæd is aræred geond widwegas, wine min Beowulf, ðin ofer þeoda gehwylce.', 'Eal þu hit geþyldum healdest, mægen mid modes snyttrum.', 'Ic þe sceal mine gelæstan freode, swa wit furðum spræcon.', 'Ðu scealt to frofre weorþan eal langtwidig leodum þinum, hæleðum to helpe.', 'Ne wearð Heremod swa eaforum Ecgwelan, Arscyldingum; ne geweox he him to willan, ac to wælfealle ond to deaðcwalum Deniga leodum; breat bolgenmod beodgeneatas, eaxlgesteallan, oþþæt he ana hwearf, mære þeoden, mondreamum from.', 'Ðeah þe hine mihtig god mægenes wynnum, eafeþum stepte, ofer ealle men forð gefremede, hwæþere him on ferhþe greow breosthord blodreow.', 'Nallas beagas geaf Denum æfter dome; dreamleas gebad þæt he þæs gewinnes weorc þrowade, leodbealo longsum.', 'Ðu þe lær be þon, gumcyste ongit; ic þis gid be þe awræc wintrum frod.', 'Wundor is to secganne hu mihtig god manna cynne þurh sidne sefan snyttru bryttað, eard ond eorlscipe; he ah ealra geweald.', 'Hwilum he on lufan læteð hworfan monnes modgeþonc mæran cynnes, seleð him on eþle eorþan wynne to healdanne, hleoburh wera, gedeð him swa gewealdene worolde dælas, side rice, þæt he his selfa ne mæg for his unsnyttrum ende geþencean.', 'Wunað he on wiste; no hine wiht dweleð adl ne yldo, ne him inwitsorh on sefan sweorceð, ne gesacu ohwær ecghete eoweð, ac him eal worold wendeð on willan (he þæt wyrse ne con), oðþæt him on innan oferhygda dæl weaxeð ond wridað.', 'Þonne se weard swefeð, sawele hyrde; bið se slæp to fæst, bisgum gebunden, bona swiðe neah, se þe of flanbogan fyrenum sceoteð.', 'Þonne bið on hreþre under helm drepen biteran stræle (him bebeorgan ne con), wom wundorbebodum wergan gastes; þinceð him to lytel þæt he lange heold, gytsað gromhydig, nallas on gylp seleð fædde beagas, ond he þa forðgesceaft forgyteð ond forgymeð, þæs þe him ær god sealde, wuldres waldend, weorðmynda dæl.', 'Hit on endestæf eft gelimpeð þæt se lichoma læne gedreoseð, fæge gefealleð; fehð oþer to, se þe unmurnlice madmas dæleþ, eorles ærgestreon, egesan ne gymeð.', 'Bebeorh þe ðone bealonið, Beowulf leofa, secg betsta, ond þe þæt selre geceos, ece rædas; oferhyda ne gym, mære cempa.', 'Nu is þines mægnes blæd ane hwile.', 'Eft sona bið þæt þec adl oððe ecg eafoþes getwæfeð, oððe fyres feng, oððe flodes wylm, oððe gripe meces, oððe gares fliht, oððe atol yldo; oððe eagena bearhtm forsiteð ond forsworceð; semninga bið þæt ðec, dryhtguma, deað oferswyðeð.', 'Swa ic Hringdena hund missera weold under wolcnum ond hig wigge beleac manigum mægþa geond þysne middangeard, æscum ond ecgum, þæt ic me ænigne under swegles begong gesacan ne tealde.', 'Hwæt, me þæs on eþle edwenden cwom, gyrn æfter gomene, seoþðan Grendel wearð, ealdgewinna, ingenga min; ic þære socne singales wæg modceare micle.', 'Þæs sig metode þanc, ecean dryhtne, þæs ðe ic on aldre gebad þæt ic on þone hafelan heorodreorigne ofer ealdgewin eagum starige! Ga nu to setle, symbelwynne dreoh wigge weorþad; unc sceal worn fela maþma gemænra, siþðan morgen bið.\" Geat wæs glædmod, geong sona to setles neosan, swa se snottra heht.', 'Þa wæs eft swa ær ellenrofum fletsittendum fægere gereorded niowan stefne.', 'Nihthelm geswearc deorc ofer dryhtgumum.', 'Duguð eal aras.', 'Wolde blondenfeax beddes neosan, gamela Scylding.', 'Geat unigmetes wel, rofne randwigan, restan lyste; sona him seleþegn siðes wergum, feorrancundum, forð wisade, se for andrysnum ealle beweotede þegnes þearfe, swylce þy dogore heaþoliðende habban scoldon.', 'Reste hine þa rumheort; reced hliuade geap ond goldfah; gæst inne swæf oþþæt hrefn blaca heofones wynne bliðheort bodode.', 'Ða com beorht scacan scaþan onetton, wæron æþelingas eft to leodum fuse to farenne; wolde feor þanon cuma collenferhð ceoles neosan.', 'Heht þa se hearda Hrunting beran sunu Ecglafes, heht his sweord niman, leoflic iren; sægde him þæs leanes þanc, cwæð, he þone guðwine godne tealde, wigcræftigne, nales wordum log meces ecge; þæt wæs modig secg.', 'Ond þa siðfrome, searwum gearwe wigend wæron; eode weorð Denum æþeling to yppan, þær se oþer wæs, hæle hildedeor Hroðgar grette.', 'Beowulf maþelode, bearn Ecgþeowes: \"Nu we sæliðend secgan wyllað, feorran cumene, þæt we fundiaþ Higelac secan.', 'Wæron her tela willum bewenede; þu us wel dohtest.', 'Gif ic þonne on eorþan owihte mæg þinre modlufan maran tilian, gumena dryhten, ðonne ic gyt dyde, guðgeweorca, ic beo gearo sona.', 'Gif ic þæt gefricge ofer floda begang, þæt þec ymbsittend egesan þywað, swa þec hetende hwilum dydon, ic ðe þusenda þegna bringe, hæleþa to helpe.', 'Ic on Higelac wat, Geata dryhten, þeah ðe he geong sy, folces hyrde, þæt he mec fremman wile wordum ond worcum, þæt ic þe wel herige ond þe to geoce garholt bere, mægenes fultum, þær ðe bið manna þearf.', 'Gif him þonne Hreþric to hofum Geata geþingeð, þeodnes bearn, he mæg þær fela freonda findan; feorcyþðe beoð selran gesohte þæm þe him selfa deah.\" Hroðgar maþelode him on ondsware: \"þe þa wordcwydas wigtig drihten on sefan sende; ne hyrde ic snotorlicor on swa geongum feore guman þingian.', 'Þu eart mægenes strang ond on mode frod, wis wordcwida.', 'Wen ic talige, gif þæt gegangeð, þæt ðe gar nymeð, hild heorugrimme, Hreþles eaferan, adl oþðe iren ealdor ðinne, folces hyrde, ond þu þin feorh hafast, þæt þe Sægeatas selran næbben to geceosenne cyning ænigne, hordweard hæleþa, gyf þu healdan wylt maga rice.', 'Me þin modsefa licað leng swa wel, leofa Beowulf.', 'Hafast þu gefered þæt þam folcum sceal, Geata leodum ond Gardenum, sib gemæne, ond sacu restan, inwitniþas, þe hie ær drugon, wesan, þenden ic wealde widan rices, maþmas gemæne, manig oþerne godum gegretan ofer ganotes bæð; sceal hringnaca ofer heafu bringan lac ond luftacen.', 'Ic þa leode wat ge wið feond ge wið freond fæste geworhte, æghwæs untæle ealde wisan.\" ða git him eorla hleo inne gesealde, mago Healfdenes, maþmas [XII]; het hine mid þæm lacum leode swæse secean on gesyntum, snude eft cuman.', 'Gecyste þa cyning æþelum god, þeoden Scyldinga, ðegn betstan ond be healse genam; hruron him tearas, blondenfeaxum.', 'Him wæs bega wen, ealdum infrodum, oþres swiðor, þæt hie seoððan no geseon moston, modige on meþle.', 'Wæs him se man to þon leof þæt he þone breostwylm forberan ne mehte, ac him on hreþre hygebendum fæst æfter deorum men dyrne langað beorn wið blode.', 'Him Beowulf þanan, guðrinc goldwlanc, græsmoldan træd since hremig; sægenga bad agendfrean, se þe on ancre rad.', 'Þa wæs on gange gifu Hroðgares oft geæhted; þæt wæs an cyning, æghwæs orleahtre, oþþæt hine yldo benam mægenes wynnum, se þe oft manegum scod.', 'Cwom þa to flode felamodigra, hægstealdra heap, hringnet bæron, locene leoðosyrcan.', 'Landweard onfand eftsið eorla, swa he ær dyde; no he mid hearme of hliðes nosan gæstas grette, ac him togeanes rad, cwæð þæt wilcuman Wedera leodum scaþan scirhame to scipe foron.', 'Þa wæs on sande sægeap naca hladen herewædum, hringedstefna, mearum ond maðmum; mæst hlifade ofer Hroðgares hordgestreonum.', 'He þæm batwearde bunden golde swurd gesealde, þæt he syðþan wæs on meodubence maþme þy weorþra, yrfelafe.', 'Gewat him on naca drefan deop wæter, Dena land ofgeaf.', 'Þa wæs be mæste merehrægla sum, segl sale fæst; sundwudu þunede.', 'No þær wegflotan wind ofer yðum siðes getwæfde; sægenga for, fleat famigheals forð ofer yðe, bundenstefna ofer brimstreamas, þæt hie Geata clifu ongitan meahton, cuþe næssas.', 'Ceol up geþrang lyftgeswenced, on lande stod.', 'Hraþe wæs æt holme hyðweard geara, se þe ær lange tid leofra manna fus æt faroðe feor wlatode; sælde to sande sidfæþme scip, oncerbendum fæst, þy læs hym yþa ðrym wudu wynsuman forwrecan meahte.', 'Het þa up beran æþelinga gestreon, frætwe ond fætgold; næs him feor þanon to gesecanne sinces bryttan, Higelac Hreþling, þær æt ham wunað selfa mid gesiðum sæwealle neah.', 'Bold wæs betlic, bregorof cyning, heah in healle, Hygd swiðe geong, wis, welþungen, þeah ðe wintra lyt under burhlocan gebiden hæbbe, Hæreþes dohtor; næs hio hnah swa þeah, ne to gneað gifa Geata leodum, maþmgestreona.', 'Mod þryðo wæg, fremu folces cwen, firen ondrysne.', 'Nænig þæt dorste deor geneþan swæsra gesiða, nefne sinfrea, þæt hire an dæges eagum starede, ac him wælbende weotode tealde handgewriþene; hraþe seoþðan wæs æfter mundgripe mece geþinged, þæt hit sceadenmæl scyran moste, cwealmbealu cyðan.', 'Ne bið swylc cwenlic þeaw idese to efnanne, þeah ðe hio ænlicu sy, þætte freoðuwebbe feores onsæce æfter ligetorne leofne mannan.', 'Huru þæt onhohsnode Hemminges mæg; ealodrincende oðer sædan, þæt hio leodbealewa læs gefremede, inwitniða, syððan ærest wearð gyfen goldhroden geongum cempan, æðelum diore, syððan hio Offan flet ofer fealone flod be fæder lare siðe gesohte; ðær hio syððan well in gumstole, gode, mære, lifgesceafta lifigende breac, hiold heahlufan wið hæleþa brego, ealles moncynnes mine gefræge þone selestan bi sæm tweonum, eormencynnes.', 'Forðam Offa wæs geofum ond guðum, garcene man, wide geweorðod, wisdome heold eðel sinne; þonon Eomer woc hæleðum to helpe, Hemminges mæg, nefa Garmundes, niða cræftig.', 'Gewat him ða se hearda mid his hondscole sylf æfter sande sæwong tredan, wide waroðas.', 'Woruldcandel scan, sigel suðan fus.', 'Hi sið drugon, elne geeodon, to ðæs ðe eorla hleo, bonan Ongenþeoes burgum in innan, geongne guðcyning godne gefrunon hringas dælan.', 'Higelace wæs sið Beowulfes snude gecyðed, þæt ðær on worðig wigendra hleo, lindgestealla, lifigende cwom, heaðolaces hal to hofe gongan.', 'Hraðe wæs gerymed, swa se rica bebead, feðegestum flet innanweard.', 'Gesæt þa wið sylfne se ða sæcce genæs, mæg wið mæge, syððan mandryhten þurh hleoðorcwyde holdne gegrette, meaglum wordum.', 'Meoduscencum hwearf geond þæt healreced Hæreðes dohtor, lufode ða leode, liðwæge bær hæleðum to handa.', 'Higelac ongan sinne geseldan in sele þam hean fægre fricgcean (hyne fyrwet bræc, hwylce Sægeata siðas wæron): \"Hu lomp eow on lade, leofa Biowulf, þa ðu færinga feorr gehogodest sæcce secean ofer sealt wæter, hilde to Hiorote? Ac ðu Hroðgare widcuðne wean wihte gebettest, mærum ðeodne? Ic ðæs modceare sorhwylmum seað, siðe ne truwode leofes mannes; ic ðe lange bæd þæt ðu þone wælgæst wihte ne grette, lete Suðdene sylfe geweorðan guðe wið Grendel.', 'Gode ic þanc secge þæs ðe ic ðe gesundne geseon moste.\" Biowulf maðelode, bearn Ecgðioes: \"þæt is undyrne, dryhten Higelac, micel gemeting, monegum fira, hwylc orleghwil uncer Grendles wearð on ðam wange, þær he worna fela Sigescyldingum sorge gefremede, yrmðe to aldre.', 'Ic ðæt eall gewræc, swa begylpan ne þearf Grendeles maga ænig ofer eorðan uhthlem þone, se ðe lengest leofað laðan cynnes, facne bifongen.', 'Ic ðær furðum cwom to ðam hringsele Hroðgar gretan; sona me se mæra mago Healfdenes, syððan he modsefan minne cuðe, wið his sylfes sunu setl getæhte.', 'Weorod wæs on wynne; ne seah ic widan feorh under heofones hwealf healsittendra medudream maran.', 'Hwilum mæru cwen, friðusibb folca, flet eall geondhwearf, bædde byre geonge; oft hio beahwriðan secge sealde, ær hie to setle geong.', 'Hwilum for duguðe dohtor Hroðgares eorlum on ende ealuwæge bær; þa ic Freaware fletsittende nemnan hyrde, þær hio nægled sinc hæleðum sealde.', 'Sio gehaten is, geong, goldhroden, gladum suna Frodan; hafað þæs geworden wine Scyldinga, rices hyrde, ond þæt ræd talað, þæt he mid ðy wife wælfæhða dæl, sæcca gesette.', 'Oft seldan hwær æfter leodhryre lytle hwile bongar bugeð, þeah seo bryd duge! Mæg þæs þonne ofþyncan ðeodne Heaðobeardna ond þegna gehwam þara leoda, þonne he mid fæmnan on flett gæð, dryhtbearn Dena, duguða biwenede; on him gladiað gomelra lafe, heard ond hringmæl Heaðabeardna gestreon þenden hie ðam wæpnum wealdan moston, oððæt hie forlæddan to ðam lindplegan swæse gesiðas ond hyra sylfra feorh.', 'Þonne cwið æt beore se ðe beah gesyhð, eald æscwiga, se ðe eall geman, garcwealm gumena (him bið grim sefa), onginneð geomormod geongum cempan þurh hreðra gehygd higes cunnian, wigbealu weccean, ond þæt word acwyð: \'Meaht ðu, min wine, mece gecnawan þone þin fæder to gefeohte bær under heregriman hindeman siðe, dyre iren, þær hyne Dene slogon, weoldon wælstowe, syððan Wiðergyld læg, æfter hæleþa hryre, hwate Scyldungas? Nu her þara banena byre nathwylces frætwum hremig on flet gæð, morðres gylpeð, ond þone maðþum byreð, þone þe ðu mid rihte rædan sceoldest.\' Manað swa ond myndgað mæla gehwylce sarum wordum, oððæt sæl cymeð þæt se fæmnan þegn fore fæder dædum æfter billes bite blodfag swefeð, ealdres scyldig; him se oðer þonan losað lifigende, con him land geare.', 'Þonne bioð abrocene on ba healfe aðsweord eorla; syððan Ingelde weallað wælniðas, ond him wiflufan æfter cearwælmum colran weorðað.', 'Þy ic Heaðobeardna hyldo ne telge, dryhtsibbe dæl Denum unfæcne, freondscipe fæstne.', 'Ic sceal forð sprecan gen ymbe Grendel, þæt ðu geare cunne, sinces brytta, to hwan syððan wearð hondræs hæleða.', 'Syððan heofones gim glad ofer grundas, gæst yrre cwom, eatol, æfengrom, user neosan, ðær we gesunde sæl weardodon.', 'Þær wæs Hondscio hild onsæge, feorhbealu fægum; he fyrmest læg, gyrded cempa; him Grendel wearð, mærum maguþegne to muðbonan, leofes mannes lic eall forswealg.', 'No ðy ær ut ða gen idelhende bona blodigtoð, bealewa gemyndig, of ðam goldsele gongan wolde, ac he mægnes rof min costode, grapode gearofolm.', 'Glof hangode sid ond syllic, searobendum fæst; sio wæs orðoncum eall gegyrwed deofles cræftum ond dracan fellum.', 'He mec þær on innan unsynnigne, dior dædfruma, gedon wolde manigra sumne; hyt ne mihte swa, syððan ic on yrre uppriht astod.', 'To lang ys to reccenne hu ic ðam leodsceaðan yfla gehwylces ondlean forgeald; þær ic, þeoden min, þine leode weorðode weorcum.', 'He on weg losade, lytle hwile lifwynna breac; hwæþre him sio swiðre swaðe weardade hand on Hiorte, ond he hean ðonan modes geomor meregrund gefeoll.', 'Me þone wælræs wine Scildunga fættan golde fela leanode, manegum maðmum, syððan mergen com ond we to symble geseten hæfdon.', 'Þær wæs gidd ond gleo.', 'Gomela Scilding, felafricgende, feorran rehte; hwilum hildedeor hearpan wynne, gomenwudu grette, hwilum gyd awræc soð ond sarlic, hwilum syllic spell rehte æfter rihte rumheort cyning.', 'Hwilum eft ongan, eldo gebunden, gomel guðwiga gioguðe cwiðan, hildestrengo; hreðer inne weoll, þonne he wintrum frod worn gemunde.', 'Swa we þær inne ondlangne dæg niode naman, oððæt niht becwom oðer to yldum.', 'Þa wæs eft hraðe gearo gyrnwræce Grendeles modor, siðode sorhfull; sunu deað fornam, wighete Wedra.', 'Wif unhyre hyre bearn gewræc, beorn acwealde ellenlice; þær wæs æschere, frodan fyrnwitan, feorh uðgenge.', 'Noðer hy hine ne moston, syððan mergen cwom, deaðwerigne, Denia leode, bronde forbærnan, ne on bęl hladan leofne mannan; hio þæt lic ætbær feondes fæðmum under firgenstream.', 'Þæt wæs Hroðgare hreowa tornost þara þe leodfruman lange begeate.', 'Þa se ðeoden mec ðine life healsode hreohmod, þæt ic on holma geþring eorlscipe efnde, ealdre geneðde, mærðo fremede; he me mede gehet.', 'Ic ða ðæs wælmes, þe is wide cuð, grimne gryrelicne grundhyrde fond; þær unc hwile wæs hand gemæne, holm heolfre weoll, ond ic heafde becearf in ðam guðsele Grendeles modor eacnum ecgum, unsofte þonan feorh oðferede.', 'Næs ic fæge þa gyt, ac me eorla hleo eft gesealde maðma menigeo, maga Healfdenes.', 'Swa se ðeodkyning þeawum lyfde.', 'Nealles ic ðam leanum forloren hæfde, mægnes mede, ac he me maðmas geaf, sunu Healfdenes, on minne sylfes dom; ða ic ðe, beorncyning, bringan wylle, estum geywan.', 'Gen is eall æt ðe lissa gelong; ic lyt hafo heafodmaga nefne, Hygelac, ðec.\" Het ða in beran eaforheafodsegn, heaðosteapne helm, hare byrnan, guðsweord geatolic, gyd æfter wræc: \"Me ðis hildesceorp Hroðgar sealde, snotra fengel, sume worde het þæt ic his ærest ðe est gesægde; cwæð þæt hyt hæfde Hiorogar cyning, leod Scyldunga lange hwile; no ðy ær suna sinum syllan wolde, hwatum Heorowearde, þeah he him hold wære, breostgewædu.', 'Bruc ealles well!\" Hyrde ic þæt þam frætwum feower mearas lungre, gelice, last weardode, æppelfealuwe; he him est geteah meara ond maðma.', 'Swa sceal mæg don, nealles inwitnet oðrum bregdon dyrnum cræfte, deað renian hondgesteallan.', 'Hygelace wæs, niða heardum, nefa swyðe hold, ond gehwæðer oðrum hroþra gemyndig.', 'Hyrde ic þæt he ðone healsbeah Hygde gesealde, wrætlicne wundurmaððum, ðone þe him Wealhðeo geaf, ðeodnes dohtor, þrio wicg somod swancor ond sadolbeorht; hyre syððan wæs æfter beahðege breost geweorðod.', 'Swa bealdode bearn Ecgðeowes, guma guðum cuð, godum dædum, dreah æfter dome, nealles druncne slog heorðgeneatas; næs him hreoh sefa, ac he mancynnes mæste cræfte ginfæstan gife, þe him god sealde, heold hildedeor.', 'Hean wæs lange, swa hyne Geata bearn godne ne tealdon, ne hyne on medobence micles wyrðne drihten Wedera gedon wolde; swyðe wendon þæt he sleac wære, æðeling unfrom.', 'Edwenden cwom tireadigum menn torna gehwylces.', 'Het ða eorla hleo in gefetian, heaðorof cyning, Hreðles lafe golde gegyrede; næs mid Geatum ða sincmaðþum selra on sweordes had; þæt he on Biowulfes bearm alegde ond him gesealde seofan þusendo, bold ond bregostol.', 'Him wæs bam samod on ðam leodscipe lond gecynde, eard, eðelriht, oðrum swiðor side rice þam ðær selra wæs.', 'Eft þæt geiode ufaran dogrum hildehlæmmum, syððan Hygelac læg ond Heardrede hildemeceas under bordhreoðan to bonan wurdon, ða hyne gesohtan on sigeþeode hearde hildefrecan, Heaðoscilfingas, niða genægdan nefan Hererices, syððan Beowulfe brade rice on hand gehwearf; he geheold tela fiftig wintra (wæs ða frod cyning, eald eþelweard), oððæt an ongan deorcum nihtum draca ricsian, se ðe on heaum hofe hord beweotode, stanbeorh steapne; stig under læg, eldum uncuð.', 'Þær on innan giong niða nathwylc, se ðe neh gefeng hæðnum horde, hond [...], since fahne.', 'He þæt syððan [...], þeah ðe he slæpende besyred wurde þeofes cræfte; þæt sie ðiod onfand, bufolc beorna, þæt he gebolgen wæs.', 'Nealles mid gewealdum wyrmhord abræc sylfes willum, se ðe him sare gesceod, ac for þreanedlan þeow nathwylces hæleða bearna heteswengeas fleah, ærnes þearfa, ond ðær inne fealh, secg synbysig, sona onfunde þæt þær ðam gyste gryrebroga stod; hwæðre earmsceapen sceapen þa hyne se fær begeat.', 'Sincfæt [...]; þær wæs swylcra fela in ðam eorðhuse ærgestreona, swa hy on geardagum gumena nathwylc, eormenlafe æþelan cynnes, þanchycgende þær gehydde, deore maðmas.', 'Ealle hie deað fornam ærran mælum, ond se an ða gen leoda duguðe, se ðær lengest hwearf, weard winegeomor, wende þæs ylcan, þæt he lytel fæc longgestreona brucan moste.', 'Beorh eallgearo wunode on wonge wæteryðum neah, niwe be næsse, nearocræftum fæst.', 'Þær on innan bær eorlgestreona hringa hyrde hordwyrðne dæl, fættan goldes, fea worda cwæð: \"Heald þu nu, hruse, nu hæleð ne moston, eorla æhte! Hwæt, hyt ær on ðe gode begeaton.', 'Guðdeað fornam, feorhbealo frecne, fyra gehwylcne leoda minra, þara ðe þis lif ofgeaf, gesawon seledream.', 'Ic nah hwa sweord wege oððe feormie fæted wæge, dryncfæt deore; duguð ellor sceoc.', 'Sceal se hearda helm hyrsted golde fætum befeallen; feormynd swefað, þa ðe beadogriman bywan sceoldon, ge swylce seo herepad, sio æt hilde gebad ofer borda gebræc bite irena, brosnað æfter beorne.', 'Ne mæg byrnan hring æfter wigfruman wide feran, hæleðum be healfe.', 'Næs hearpan wyn, gomen gleobeames, ne god hafoc geond sæl swingeð, ne se swifta mearh burhstede beateð.', 'Bealocwealm hafað fela feorhcynna forð onsended!\" Swa giomormod giohðo mænde an æfter eallum, unbliðe hwearf dæges ond nihtes, oððæt deaðes wylm hran æt heortan.', 'Hordwynne fond eald uhtsceaða opene standan, se ðe byrnende biorgas seceð, nacod niðdraca, nihtes fleogeð fyre befangen; hyne foldbuend swiðe ondrædað.', 'He gesecean sceall hord on hrusan, þær he hæðen gold warað wintrum frod, ne byð him wihte ðy sel.', 'Swa se ðeodsceaða þreo hund wintra heold on hrusan hordærna sum, eacencræftig, oððæt hyne an abealch mon on mode; mandryhtne bær fæted wæge, frioðowære bæd hlaford sinne.', 'Ða wæs hord rasod, onboren beaga hord, bene getiðad feasceaftum men.', 'Frea sceawode fira fyrngeweorc forman siðe.', 'Þa se wyrm onwoc, wroht wæs geniwad; stonc ða æfter stane, stearcheort onfand feondes fotlast; he to forð gestop dyrnan cræfte dracan heafde neah.', 'Swa mæg unfæge eaðe gedigan wean ond wræcsið, se ðe waldendes hyldo gehealdeþ! Hordweard sohte georne æfter grunde, wolde guman findan, þone þe him on sweofote sare geteode, hat ond hreohmod hlæw oft ymbehwearf ealne utanweardne, ne ðær ænig mon on þære westenne; hwæðre wiges gefeh, beaduwe weorces, hwilum on beorh æthwearf, sincfæt sohte.', 'He þæt sona onfand ðæt hæfde gumena sum goldes gefandod, heahgestreona.', 'Hordweard onbad earfoðlice oððæt æfen cwom; wæs ða gebolgen beorges hyrde, wolde se laða lige forgyldan drincfæt dyre.', 'Þa wæs dæg sceacen wyrme on willan; no on wealle læg, bidan wolde, ac mid bæle for, fyre gefysed.', 'Wæs se fruma egeslic leodum on lande, swa hyt lungre wearð on hyra sincgifan sare geendod.', 'Ða se gæst ongan gledum spiwan, beorht hofu bærnan; bryneleoma stod eldum on andan.', 'No ðær aht cwices lað lyftfloga læfan wolde.', 'Wæs þæs wyrmes wig wide gesyne, nearofages nið nean ond feorran, hu se guðsceaða Geata leode hatode ond hynde; hord eft gesceat, dryhtsele dyrnne, ær dæges hwile.', 'Hæfde landwara lige befangen, bæle ond bronde, beorges getruwode, wiges ond wealles; him seo wen geleah.', 'Þa wæs Biowulfe broga gecyðed snude to soðe, þæt his sylfes ham, bolda selest, brynewylmum mealt, gifstol Geata.', 'Þæt ðam godan wæs hreow on hreðre, hygesorga mæst; wende se wisa þæt he wealdende ofer ealde riht, ecean dryhtne, bitre gebulge.', 'Breost innan weoll þeostrum geþoncum, swa him geþywe ne wæs.', 'Hæfde ligdraca leoda fæsten, ealond utan, eorðweard ðone gledum forgrunden; him ðæs guðkyning, Wedera þioden, wræce leornode.', 'Heht him þa gewyrcean wigendra hleo eallirenne, eorla dryhten, wigbord wrætlic; wisse he gearwe þæt him holtwudu helpan ne meahte, lind wið lige.', 'Sceolde lændaga æþeling ærgod ende gebidan, worulde lifes, ond se wyrm somod, þeah ðe hordwelan heolde lange.', 'Oferhogode ða hringa fengel þæt he þone widflogan weorode gesohte, sidan herge; no he him þa sæcce ondred, ne him þæs wyrmes wig for wiht dyde, eafoð ond ellen, forðon he ær fela nearo neðende niða gedigde, hildehlemma, syððan he Hroðgares, sigoreadig secg, sele fælsode ond æt guðe forgrap Grendeles mægum laðan cynnes.', 'No þæt læsest wæs hondgemota, þær mon Hygelac sloh, syððan Geata cyning guðe ræsum, freawine folca Freslondum on, Hreðles eafora hiorodryncum swealt, bille gebeaten.', 'Þonan Biowulf com sylfes cræfte, sundnytte dreah; hæfde him on earme ana [XXX] hildegeatwa, þa he to holme beag.', 'Nealles Hetware hremge þorfton feðewiges, þe him foran ongean linde bæron; lyt eft becwom fram þam hildfrecan hames niosan.', 'Oferswam ða sioleða bigong sunu Ecgðeowes, earm anhaga, eft to leodum; þær him Hygd gebead hord ond rice, beagas ond bregostol, bearne ne truwode þæt he wið ælfylcum eþelstolas healdan cuðe, ða wæs Hygelac dead.', 'No ðy ær feasceafte findan meahton æt ðam æðelinge ænige ðinga, þæt he Heardrede hlaford wære oððe þone cynedom ciosan wolde; hwæðre he him on folce freondlarum heold, estum mid are, oððæt he yldra wearð, Wedergeatum weold.', 'Hyne wræcmæcgas ofer sæ sohtan, suna Ohteres; hæfdon hy forhealden helm Scylfinga, þone selestan sæcyninga þara ðe in Swiorice sinc brytnade, mærne þeoden.', 'Him þæt to mearce wearð; he þær for feorme feorhwunde hleat sweordes swengum, sunu Hygelaces, ond him eft gewat Ongenðioes bearn hames niosan, syððan Heardred læg, let ðone bregostol Biowulf healdan, Geatum wealdan.', 'Þæt wæs god cyning! Se ðæs leodhryres lean gemunde uferan dogrum, Eadgilse wearð feasceaftum freond, folce gestepte ofer sæ side sunu Ohteres, wigum ond wæpnum; he gewræc syððan cealdum cearsiðum, cyning ealdre bineat.', 'Swa he niða gehwane genesen hæfde, sliðra geslyhta, sunu Ecgðiowes, ellenweorca, oð ðone anne dæg þe he wið þam wyrme gewegan sceolde.', 'Gewat þa [XII]a sum torne gebolgen dryhten Geata dracan sceawian.', 'Hæfde þa gefrunen hwanan sio fæhð aras, bealonið biorna; him to bearme cwom maðþumfæt mære þurh ðæs meldan hond.', 'Se wæs on ðam ðreate þreotteoða secg, se ðæs orleges or onstealde, hæft hygegiomor, sceolde hean ðonon wong wisian.', 'He ofer willan giong to ðæs ðe he eorðsele anne wisse, hlæw under hrusan holmwylme neh, yðgewinne; se wæs innan full wrætta ond wira.', 'Weard unhiore, gearo guðfreca, goldmaðmas heold, eald under eorðan.', 'Næs þæt yðe ceap to gegangenne gumena ænigum! Gesæt ða on næsse niðheard cyning, þenden hælo abead heorðgeneatum, goldwine Geata.', 'Him wæs geomor sefa, wæfre ond wælfus, wyrd ungemete neah, se ðone gomelan gretan sceolde, secean sawle hord, sundur gedælan lif wið lice, no þon lange wæs feorh æþelinges flæsce bewunden.', 'Biowulf maþelade, bearn Ecgðeowes: \"Fela ic on giogoðe guðræsa genæs, orleghwila; ic þæt eall gemon.', 'Ic wæs syfanwintre, þa mec sinca baldor, freawine folca, æt minum fæder genam; heold mec ond hæfde Hreðel cyning, geaf me sinc ond symbel, sibbe gemunde.', 'Næs ic him to life laðra owihte, beorn in burgum, þonne his bearna hwylc, Herebeald ond Hæðcyn oððe Hygelac min.', 'Wæs þam yldestan ungedefelice mæges dædum morþorbed stred, syððan hyne Hæðcyn of hornbogan, his freawine, flane geswencte, miste mercelses ond his mæg ofscet, broðor oðerne blodigan gare.', 'Þæt wæs feohleas gefeoht, fyrenum gesyngad, hreðre hygemeðe; sceolde hwæðre swa þeah æðeling unwrecen ealdres linnan.', 'Swa bið geomorlic gomelum ceorle to gebidanne, þæt his byre ride giong on galgan, þonne he gyd wrece, sarigne sang, þonne his sunu hangað hrefne to hroðre, ond he him helpe ne mæg, eald ond infrod, ænige gefremman.', 'Symble bið gemyndgad morna gehwylce eaforan ellorsið; oðres ne gymeð to gebidanne burgum in innan yrfeweardas, þonne se an hafað þurh deaðes nyd dæda gefondad.', 'Gesyhð sorhcearig on his suna bure winsele westne, windge reste reote berofene.', 'Ridend swefað, hæleð in hoðman; nis þær hearpan sweg, gomen in geardum, swylce ðær iu wæron.', 'Gewiteð þonne on sealman, sorhleoð gæleð an æfter anum; þuhte him eall to rum, wongas ond wicstede.', 'Swa Wedra helm æfter Herebealde heortan sorge weallende wæg.', 'Wihte ne meahte on ðam feorhbonan fæghðe gebetan; no ðy ær he þone heaðorinc hatian ne meahte laðum dædum, þeah him leof ne wæs.', 'He ða mid þære sorhge, þe him swa sar belamp, gumdream ofgeaf, godes leoht geceas, eaferum læfde, swa deð eadig mon, lond ond leodbyrig, þa he of life gewat.', 'Þa wæs synn ond sacu Sweona ond Geata ofer wid wæter, wroht gemæne, herenið hearda, syððan Hreðel swealt, oððe him Ongenðeowes eaferan wæran frome, fyrdhwate, freode ne woldon ofer heafo healdan, ac ymb Hreosnabeorh eatolne inwitscear oft gefremedon.', 'Þæt mægwine mine gewræcan, fæhðe ond fyrene, swa hyt gefræge wæs, þeah ðe oðer his ealdre gebohte, heardan ceape; Hæðcynne wearð, Geata dryhtne, guð onsæge.', 'Þa ic on morgne gefrægn mæg oðerne billes ecgum on bonan stælan, þær Ongenþeow Eofores niosað.', 'Guðhelm toglad, gomela Scylfing hreas hildeblac; hond gemunde fæhðo genoge, feorhsweng ne ofteah.', 'Ic him þa maðmas, þe he me sealde, geald æt guðe, swa me gifeðe wæs, leohtan sweorde; he me lond forgeaf, eard, eðelwyn.', 'Næs him ænig þearf þæt he to Gifðum oððe to Gardenum oððe in Swiorice secean þurfe wyrsan wigfrecan, weorðe gecypan.', 'Symle ic him on feðan beforan wolde, ana on orde, ond swa to aldre sceall sæcce fremman, þenden þis sweord þolað, þæt mec ær ond sið oft gelæste.', 'Syððan ic for dugeðum Dæghrefne wearð to handbonan, Huga cempan; nalles he ða frætwe Frescyninge, breostweorðunge, bringan moste, ac in compe gecrong cumbles hyrde, æþeling on elne; ne wæs ecg bona, ac him hildegrap heortan wylmas, banhus gebræc.', 'Nu sceall billes ecg, hond ond heard sweord, ymb hord wigan.\" Beowulf maðelode, beotwordum spræc niehstan siðe: \"Ic geneðde fela guða on geogoðe; gyt ic wylle, frod folces weard, fæhðe secan, mærðu fremman, gif mec se mansceaða of eorðsele ut geseceð.\" Gegrette ða gumena gehwylcne, hwate helmberend, hindeman siðe, swæse gesiðas: \"Nolde ic sweord beran, wæpen to wyrme, gif ic wiste hu wið ðam aglæcean elles meahte gylpe wiðgripan, swa ic gio wið Grendle dyde.', 'Ac ic ðær heaðufyres hates wene, oreðes ond attres; forðon ic me on hafu bord ond byrnan.', 'Nelle ic beorges weard forfleon fotes trem, ac unc furður sceal weorðan æt wealle, swa unc wyrd geteoð, metod manna gehwæs.', 'Ic eom on mode from þæt ic wið þone guðflogan gylp ofersitte.', 'Gebide ge on beorge byrnum werede, secgas on searwum, hwæðer sel mæge æfter wælræse wunde gedygan uncer twega.', 'Nis þæt eower sið ne gemet mannes, nefne min anes, þæt he wið aglæcean eofoðo dæle, eorlscype efne.', 'Ic mid elne sceall gold gegangan, oððe guð nimeð, feorhbealu frecne, frean eowerne!\" Aras ða bi ronde rof oretta, heard under helme, hiorosercean bær under stancleofu, strengo getruwode anes mannes.', 'Ne bið swylc earges sið! Geseah ða be wealle se ðe worna fela, gumcystum god, guða gedigde, hildehlemma, þonne hnitan feðan, stondan stanbogan, stream ut þonan brecan of beorge.', 'Wæs þære burnan wælm heaðofyrum hat; ne meahte horde neah unbyrnende ænige hwile deop gedygan for dracan lege.', 'Let ða of breostum, ða he gebolgen wæs, Wedergeata leod word ut faran, stearcheort styrmde; stefn in becom heaðotorht hlynnan under harne stan.', 'Hete wæs onhrered, hordweard oncniow mannes reorde; næs ðær mara fyrst freode to friclan.', 'From ærest cwom oruð aglæcean ut of stane, hat hildeswat.', 'Hruse dynede.', 'Biorn under beorge bordrand onswaf wið ðam gryregieste, Geata dryhten; ða wæs hringbogan heorte gefysed sæcce to seceanne.', 'Sweord ær gebræd god guðcyning, gomele lafe, ecgum unslaw; æghwæðrum wæs bealohycgendra broga fram oðrum.', 'Stiðmod gestod wið steapne rond winia bealdor, ða se wyrm gebeah snude tosomne; he on searwum bad.', 'Gewat ða byrnende gebogen scriðan, to gescipe scyndan.', 'Scyld wel gebearg life ond lice læssan hwile mærum þeodne þonne his myne sohte, ðær he þy fyrste, forman dogore wealdan moste swa him wyrd ne gescraf hreð æt hilde.', 'Hond up abræd Geata dryhten, gryrefahne sloh incgelafe, þæt sio ecg gewac brun on bane, bat unswiðor þonne his ðiodcyning þearfe hæfde, bysigum gebæded.', 'Þa wæs beorges weard æfter heaðuswenge on hreoum mode, wearp wælfyre; wide sprungon hildeleoman.', 'Hreðsigora ne gealp goldwine Geata; guðbill geswac, nacod æt niðe, swa hyt no sceolde, iren ærgod.', 'Ne wæs þæt eðe sið, þæt se mæra maga Ecgðeowes grundwong þone ofgyfan wolde; sceolde ofer willan wic eardian elles hwergen, swa sceal æghwylc mon alætan lændagas.', 'Næs ða long to ðon þæt ða aglæcean hy eft gemetton.', 'Hyrte hyne hordweard (hreðer æðme weoll) niwan stefne; nearo ðrowode, fyre befongen, se ðe ær folce weold.', 'Nealles him on heape handgesteallan, æðelinga bearn, ymbe gestodon hildecystum, ac hy on holt bugon, ealdre burgan.', 'Hiora in anum weoll sefa wið sorgum; sibb æfre ne mæg wiht onwendan þam ðe wel þenceð.', 'Wiglaf wæs haten Weoxstanes sunu, leoflic lindwiga, leod Scylfinga, mæg ælfheres; geseah his mondryhten under heregriman hat þrowian.', 'Gemunde ða ða are þe he him ær forgeaf, wicstede weligne Wægmundinga, folcrihta gehwylc, swa his fæder ahte.', 'Ne mihte ða forhabban; hond rond gefeng, geolwe linde, gomel swyrd geteah, þæt wæs mid eldum Eanmundes laf, suna Ohteres.', 'Þam æt sæcce wearð, wræccan wineleasum, Weohstan bana meces ecgum, ond his magum ætbær brunfagne helm, hringde byrnan, eald sweord etonisc; þæt him Onela forgeaf, his gædelinges guðgewædu, fyrdsearo fuslic, no ymbe ða fæhðe spræc, þeah ðe he his broðor bearn abredwade.', 'He frætwe geheold fela missera, bill ond byrnan, oððæt his byre mihte eorlscipe efnan swa his ærfæder; geaf him ða mid Geatum guðgewæda, æghwæs unrim, þa he of ealdre gewat, frod on forðweg.', 'Þa wæs forma sið geongan cempan, þæt he guðe ræs mid his freodryhtne fremman sceolde.', 'Ne gemealt him se modsefa, ne his mæges laf gewac æt wige; þæt se wyrm onfand, syððan hie togædre gegan hæfdon.', 'Wiglaf maðelode, wordrihta fela sægde gesiðum (him wæs sefa geomor): \"Ic ðæt mæl geman, þær we medu þegun, þonne we geheton ussum hlaforde in biorsele, ðe us ðas beagas geaf, þæt we him ða guðgetawa gyldan woldon gif him þyslicu þearf gelumpe, helmas ond heard sweord.', 'Ðe he usic on herge geceas to ðyssum siðfate sylfes willum, onmunde usic mærða, ond me þas maðmas geaf, þe he usic garwigend gode tealde, hwate helmberend, þeah ðe hlaford us þis ellenweorc ana aðohte to gefremmanne, folces hyrde, for ðam he manna mæst mærða gefremede, dæda dollicra.', 'Nu is se dæg cumen þæt ure mandryhten mægenes behofað, godra guðrinca; wutun gongan to, helpan hildfruman, þenden hyt sy, gledegesa grim.', 'God wat on mec þæt me is micle leofre þæt minne lichaman mid minne goldgyfan gled fæðmie.', 'Ne þynceð me gerysne þæt we rondas beren eft to earde, nemne we æror mægen fane gefyllan, feorh ealgian Wedra ðeodnes.', 'Ic wat geare þæt næron ealdgewyrht, þæt he ana scyle Geata duguðe gnorn þrowian, gesigan æt sæcce; urum sceal sweord ond helm, byrne ond beaduscrud, bam gemæne.\" Wod þa þurh þone wælrec, wigheafolan bær frean on fultum, fea worda cwæð: \"Leofa Biowulf, læst eall tela, swa ðu on geoguðfeore geara gecwæde þæt ðu ne alæte be ðe lifigendum dom gedreosan.', 'Scealt nu dædum rof, æðeling anhydig, ealle mægene feorh ealgian; ic ðe fullæstu.\" æfter ðam wordum wyrm yrre cwom, atol inwitgæst, oðre siðe fyrwylmum fah fionda niosian, laðra manna; ligyðum for.', 'Born bord wið rond, byrne ne meahte geongum garwigan geoce gefremman, ac se maga geonga under his mæges scyld elne geeode, þa his agen wæs gledum forgrunden.', 'Þa gen guðcyning mærða gemunde, mægenstrengo sloh hildebille, þæt hyt on heafolan stod niþe genyded; Nægling forbærst, geswac æt sæcce sweord Biowulfes, gomol ond grægmæl.', 'Him þæt gifeðe ne wæs þæt him irenna ecge mihton helpan æt hilde; wæs sio hond to strong, se ðe meca gehwane, mine gefræge, swenge ofersohte, þonne he to sæcce bær wæpen wundrum heard; næs him wihte ðe sel.', 'Þa wæs þeodsceaða þriddan siðe, frecne fyrdraca, fæhða gemyndig, ræsde on ðone rofan, þa him rum ageald, hat ond heaðogrim, heals ealne ymbefeng biteran banum; he geblodegod wearð sawuldriore, swat yðum weoll.', 'Ða ic æt þearfe gefrægn þeodcyninges andlongne eorl ellen cyðan, cræft ond cenðu, swa him gecynde wæs.', 'Ne hedde he þæs heafolan, ac sio hand gebarn modiges mannes, þær he his mæges healp, þæt he þone niðgæst nioðor hwene sloh, secg on searwum, þæt ðæt sweord gedeaf, fah ond fæted, þæt ðæt fyr ongon sweðrian syððan.', 'Þa gen sylf cyning geweold his gewitte, wællseaxe gebræd biter ond beaduscearp, þæt he on byrnan wæg; forwrat Wedra helm wyrm on middan.', 'Feond gefyldan (ferh ellen wræc), ond hi hyne þa begen abroten hæfdon, sibæðelingas.', 'Swylc sceolde secg wesan, þegn æt ðearfe! þæt ðam þeodne wæs siðast sigehwila sylfes dædum, worlde geweorces.', 'Ða sio wund ongon, þe him se eorðdraca ær geworhte, swelan ond swellan; he þæt sona onfand, þæt him on breostum bealoniðe weoll attor on innan.', 'Ða se æðeling giong þæt he bi wealle wishycgende gesæt on sesse; seah on enta geweorc, hu ða stanbogan stapulum fæste ece eorðreced innan healde.', 'Hyne þa mid handa heorodreorigne, þeoden mærne, þegn ungemete till winedryhten his wætere gelafede, hilde sædne, ond his helm onspeon.', 'Biowulf maþelode (he ofer benne spræc, wunde wælbleate; wisse he gearwe þæt he dæghwila gedrogen hæfde, eorðan wynne; ða wæs eall sceacen dogorgerimes, deað ungemete neah): \"Nu ic suna minum syllan wolde guðgewædu, þær me gifeðe swa ænig yrfeweard æfter wurde lice gelenge.', 'Ic ðas leode heold fiftig wintra; næs se folccyning, ymbesittendra ænig ðara, þe mec guðwinum gretan dorste, egesan ðeon.', 'Ic on earde bad mælgesceafta, heold min tela, ne sohte searoniðas, ne me swor fela aða on unriht.', 'Ic ðæs ealles mæg feorhbennum seoc gefean habban; for ðam me witan ne ðearf waldend fira morðorbealo maga, þonne min sceaceð lif of lice.', 'Nu ðu lungre geong hord sceawian under harne stan, Wiglaf leofa, nu se wyrm ligeð, swefeð sare wund, since bereafod.', 'Bio nu on ofoste, þæt ic ærwelan, goldæht ongite, gearo sceawige swegle searogimmas, þæt ic ðy seft mæge æfter maððumwelan min alætan lif ond leodscipe, þone ic longe heold.\" ða ic snude gefrægn sunu Wihstanes æfter wordcwydum wundum dryhtne hyran heaðosiocum, hringnet beran, brogdne beadusercean under beorges hrof.', 'Geseah ða sigehreðig, þa he bi sesse geong, magoþegn modig maððumsigla fealo, gold glitinian grunde getenge, wundur on wealle, ond þæs wyrmes denn, ealdes uhtflogan, orcas stondan, fyrnmanna fatu feormendlease, hyrstum behrorene; þær wæs helm monig eald ond omig, earmbeaga fela searwum gesæled.', 'Sinc eaðe mæg, gold on grunde, gumcynnes gehwone oferhigian, hyde se ðe wylle.', 'Swylce he siomian geseah segn eallgylden heah ofer horde, hondwundra mæst, gelocen leoðocræftum; of ðam leoma stod, þæt he þone grundwong ongitan meahte, wræte giondwlitan.', 'Næs ðæs wyrmes þær onsyn ænig, ac hyne ecg fornam.', 'Ða ic on hlæwe gefrægn hord reafian, eald enta geweorc, anne mannan, him on bearm hladon bunan ond discas sylfes dome; segn eac genom, beacna beorhtost.', 'Bill ær gescod (ecg wæs iren) ealdhlafordes þam ðara maðma mundbora wæs longe hwile, ligegesan wæg hatne for horde, hioroweallende middelnihtum, oðþæt he morðre swealt.', 'Ar wæs on ofoste, eftsiðes georn, frætwum gefyrðred; hyne fyrwet bræc, hwæðer collenferð cwicne gemette in ðam wongstede Wedra þeoden ellensiocne, þær he hine ær forlet.', 'He ða mid þam maðmum mærne þioden, dryhten sinne, driorigne fand ealdres æt ende; he hine eft ongon wæteres weorpan, oðþæt wordes ord breosthord þurhbræc.', 'gomel on giohðe (gold sceawode): \"Ic ðara frætwa frean ealles ðanc, wuldurcyninge, wordum secge, ecum dryhtne, þe ic her on starie, þæs ðe ic moste minum leodum ær swyltdæge swylc gestrynan.', 'Nu ic on maðma hord mine bebohte frode feorhlege, fremmað gena leoda þearfe; ne mæg ic her leng wesan.', 'Hatað heaðomære hlæw gewyrcean beorhtne æfter bæle æt brimes nosan; se scel to gemyndum minum leodum heah hlifian on Hronesnæsse, þæt hit sæliðend syððan hatan Biowulfes biorh, ða ðe brentingas ofer floda genipu feorran drifað.\" Dyde him of healse hring gyldenne þioden þristhydig, þegne gesealde, geongum garwigan, goldfahne helm, beah ond byrnan, het hyne brucan well: \"þu eart endelaf usses cynnes, Wægmundinga.', 'Ealle wyrd forsweop mine magas to metodsceafte, eorlas on elne; ic him æfter sceal.\" þæt wæs þam gomelan gingæste word breostgehygdum, ær he bæl cure, hate heaðowylmas; him of hreðre gewat sawol secean soðfæstra dom.', 'Ða wæs gegongen guman unfrodum earfoðlice, þæt he on eorðan geseah þone leofestan lifes æt ende bleate gebæran.', 'Bona swylce læg, egeslic eorðdraca ealdre bereafod, bealwe gebæded.', 'Beahhordum leng wyrm wohbogen wealdan ne moste, ac hine irenna ecga fornamon, hearde, heaðoscearde homera lafe, þæt se widfloga wundum stille hreas on hrusan hordærne neah.', 'Nalles æfter lyfte lacende hwearf middelnihtum, maðmæhta wlonc ansyn ywde, ac he eorðan gefeoll for ðæs hildfruman hondgeweorce.', 'Huru þæt on lande lyt manna ðah, mægenagendra, mine gefræge, þeah ðe he dæda gehwæs dyrstig wære, þæt he wið attorsceaðan oreðe geræsde, oððe hringsele hondum styrede, gif he wæccende weard onfunde buon on beorge.', 'Biowulfe wearð dryhtmaðma dæl deaðe forgolden; hæfde æghwæðer ende gefered lænan lifes.', 'Næs ða lang to ðon þæt ða hildlatan holt ofgefan, tydre treowlogan tyne ætsomne.', 'Ða ne dorston ær dareðum lacan on hyra mandryhtnes miclan þearfe, ac hy scamiende scyldas bæran, guðgewædu, þær se gomela læg, wlitan on Wilaf.', 'He gewergad sæt, feðecempa, frean eaxlum neah, wehte hyne wætre; him wiht ne speow.', 'Ne meahte he on eorðan, ðeah he uðe wel, on ðam frumgare feorh gehealdan, ne ðæs wealdendes wiht oncirran; wolde dom godes dædum rædan gumena gehwylcum, swa he nu gen deð.', 'Þa wæs æt ðam geongan grim ondswaru eðbegete þam ðe ær his elne forleas.', 'Wiglaf maðelode, Weohstanes sunu, sec, sarigferð (seah on unleofe): \"þæt, la, mæg secgan se ðe wyle soð specan þæt se mondryhten se eow ða maðmas geaf, eoredgeatwe, þe ge þær on standað, þonne he on ealubence oft gesealde healsittendum helm ond byrnan, þeoden his þegnum, swylce he þrydlicost ower feor oððe neah findan meahte, þæt he genunga guðgewædu wraðe forwurpe, ða hyne wig beget.', 'Nealles folccyning fyrdgesteallum gylpan þorfte; hwæðre him god uðe, sigora waldend, þæt he hyne sylfne gewræc ana mid ecge, þa him wæs elnes þearf.', 'Ic him lifwraðe lytle meahte ætgifan æt guðe, ond ongan swa þeah ofer min gemet mæges helpan; symle wæs þy sæmra, þonne ic sweorde drep ferhðgeniðlan, fyr unswiðor weoll of gewitte.', 'Wergendra to lyt þrong ymbe þeoden, þa hyne sio þrag becwom.', 'Nu sceal sincþego ond swyrdgifu, eall eðelwyn eowrum cynne, lufen alicgean; londrihtes mot þære mægburge monna æghwylc idel hweorfan, syððan æðelingas feorran gefricgean fleam eowerne, domleasan dæd.', 'Deað bið sella eorla gehwylcum þonne edwitlif!\" Heht ða þæt heaðoweorc to hagan biodan up ofer ecgclif, þær þæt eorlweorod morgenlongne dæg modgiomor sæt, bordhæbbende, bega on wenum, endedogores ond eftcymes leofes monnes.', 'Lyt swigode niwra spella se ðe næs gerad, ac he soðlice sægde ofer ealle: \"Nu is wilgeofa Wedra leoda, dryhten Geata, deaðbedde fæst, wunað wælreste wyrmes dædum.', 'Him on efn ligeð ealdorgewinna sexbennum seoc; sweorde ne meahte on ðam aglæcean ænige þinga wunde gewyrcean.', 'Wiglaf siteð ofer Biowulfe, byre Wihstanes, eorl ofer oðrum unlifigendum, healdeð higemæðum heafodwearde leofes ond laðes.', 'Nu ys leodum wen orleghwile, syððan underne Froncum ond Frysum fyll cyninges wide weorðeð.', 'Wæs sio wroht scepen heard wið Hugas, syððan Higelac cwom faran flotherge on Fresna land, þær hyne Hetware hilde genægdon, elne geeodon mid ofermægene, þæt se byrnwiga bugan sceolde, feoll on feðan, nalles frætwe geaf ealdor dugoðe.', 'Us wæs a syððan Merewioingas milts ungyfeðe.', 'Ne ic to Sweoðeode sibbe oððe treowe wihte ne wene, ac wæs wide cuð þætte Ongenðio ealdre besnyðede Hæðcen Hreþling wið Hrefnawudu, þa for onmedlan ærest gesohton Geata leode Guðscilfingas.', 'Sona him se froda fæder Ohtheres, eald ond egesfull, ondslyht ageaf, abreot brimwisan, bryd ahredde, gomela iomeowlan golde berofene, Onelan modor ond Ohtheres, ond ða folgode feorhgeniðlan, oððæt hi oðeodon earfoðlice in Hrefnesholt hlafordlease.', 'Besæt ða sinherge sweorda lafe, wundum werge, wean oft gehet earmre teohhe ondlonge niht, cwæð, he on mergenne meces ecgum getan wolde, sum on galgtreowum fuglum to gamene.', 'Frofor eft gelamp sarigmodum somod ærdæge, syððan hie Hygelaces horn ond byman, gealdor ongeaton, þa se goda com leoda dugoðe on last faran.', 'Wæs sio swatswaðu Sweona ond Geata, wælræs weora wide gesyne, hu ða folc mid him fæhðe towehton.', 'Gewat him ða se goda mid his gædelingum, frod, felageomor, fæsten secean, eorl Ongenþio, ufor oncirde; hæfde Higelaces hilde gefrunen, wlonces wigcræft, wiðres ne truwode, þæt he sæmannum onsacan mihte, heaðoliðendum hord forstandan, bearn ond bryde; beah eft þonan eald under eorðweall.', 'Þa wæs æht boden Sweona leodum, segn Higelaces freoðowong þone forð ofereodon, syððan Hreðlingas to hagan þrungon.', 'Þær wearð Ongenðiow ecgum sweorda, blondenfexa, on bid wrecen, þæt se þeodcyning ðafian sceolde Eafores anne dom.', 'Hyne yrringa Wulf Wonreding wæpne geræhte, þæt him for swenge swat ædrum sprong forð under fexe.', 'Næs he forht swa ðeh, gomela Scilfing, ac forgeald hraðe wyrsan wrixle wælhlem þone, syððan ðeodcyning þyder oncirde.', 'Ne meahte se snella sunu Wonredes ealdum ceorle ondslyht giofan, ac he him on heafde helm ær gescer, þæt he blode fah bugan sceolde, feoll on foldan; næs he fæge þa git, ac he hyne gewyrpte, þeah ðe him wund hrine.', 'Let se hearda Higelaces þegn bradne mece, þa his broðor læg, eald sweord eotonisc, entiscne helm brecan ofer bordweal; ða gebeah cyning, folces hyrde, wæs in feorh dropen.', 'Ða wæron monige þe his mæg wriðon, ricone arærdon, ða him gerymed wearð þæt hie wælstowe wealdan moston.', 'Þenden reafode rinc oðerne, nam on Ongenðio irenbyrnan, heard swyrd hilted ond his helm somod, hares hyrste Higelace bær.', 'He ðam frætwum feng ond him fægre gehet leana mid leodum, ond gelæste swa; geald þone guðræs Geata dryhten, Hreðles eafora, þa he to ham becom, Iofore ond Wulfe mid ofermaðmum, sealde hiora gehwæðrum hund þusenda landes ond locenra beaga (ne ðorfte him ða lean oðwitan mon on middangearde), syððan hie ða mærða geslogon, ond ða Iofore forgeaf angan dohtor, hamweorðunge, hyldo to wedde.', 'Þæt ys sio fæhðo ond se feondscipe, wælnið wera, ðæs ðe ic wen hafo, þe us seceað to Sweona leoda, syððan hie gefricgeað frean userne ealdorleasne, þone ðe ær geheold wið hettendum hord ond rice æfter hæleða hryre, hwate Scildingas, folcred fremede oððe furður gen eorlscipe efnde.', 'Nu is ofost betost þæt we þeodcyning þær sceawian ond þone gebringan, þe us beagas geaf, on adfære.', 'Ne scel anes hwæt meltan mid þam modigan, ac þær is maðma hord, gold unrime grimme geceapod, ond nu æt siðestan sylfes feore beagas gebohte.', 'Þa sceall brond fretan, æled þeccean, nalles eorl wegan maððum to gemyndum, ne mægð scyne habban on healse hringweorðunge, ac sceal geomormod, golde bereafod, oft nalles æne elland tredan, nu se herewisa hleahtor alegde, gamen ond gleodream.', 'Forðon sceall gar wesan monig, morgenceald, mundum bewunden, hæfen on handa, nalles hearpan sweg wigend weccean, ac se wonna hrefn fus ofer fægum fela reordian, earne secgan hu him æt æte speow, þenden he wið wulf wæl reafode.\" Swa se secg hwata secggende wæs laðra spella; he ne leag fela wyrda ne worda.', 'Weorod eall aras; eodon unbliðe under Earnanæs, wollenteare wundur sceawian.', 'Fundon ða on sande sawulleasne hlimbed healdan þone þe him hringas geaf ærran mælum; þa wæs endedæg godum gegongen, þæt se guðcyning, Wedra þeoden, wundordeaðe swealt.', 'Ær hi þær gesegan syllicran wiht, wyrm on wonge wiðerræhtes þær laðne licgean; wæs se legdraca grimlic, gryrefah, gledum beswæled.', 'Se wæs fiftiges fotgemearces lang on legere, lyftwynne heold nihtes hwilum, nyðer eft gewat dennes niosian; wæs ða deaðe fæst, hæfde eorðscrafa ende genyttod.', 'Him big stodan bunan ond orcas, discas lagon ond dyre swyrd, omige, þurhetone, swa hie wið eorðan fæðm þusend wintra þær eardodon.', 'Þonne wæs þæt yrfe, eacencræftig, iumonna gold galdre bewunden, þæt ðam hringsele hrinan ne moste gumena ænig, nefne god sylfa, sigora soðcyning, sealde þam ðe he wolde (he is manna gehyld) hord openian, efne swa hwylcum manna swa him gemet ðuhte.', 'Þa wæs gesyne þæt se sið ne ðah þam ðe unrihte inne gehydde wræte under wealle.', 'Weard ær ofsloh feara sumne; þa sio fæhð gewearð gewrecen wraðlice.', 'Wundur hwar þonne eorl ellenrof ende gefere lifgesceafta, þonne leng ne mæg mon mid his magum meduseld buan.', 'Swa wæs Biowulfe, þa he biorges weard sohte, searoniðas; seolfa ne cuðe þurh hwæt his worulde gedal weorðan sceolde.', 'Swa hit oð domes dæg diope benemdon þeodnas mære, þa ðæt þær dydon, þæt se secg wære synnum scildig, hergum geheaðerod, hellbendum fæst, wommum gewitnad, se ðone wong strude, næs he goldhwæte gearwor hæfde agendes est ær gesceawod.', 'Wiglaf maðelode, Wihstanes sunu: \"Oft sceall eorl monig anes willan wræc adreogan, swa us geworden is.', 'Ne meahton we gelæran leofne þeoden, rices hyrde, ræd ænigne, þæt he ne grette goldweard þone, lete hyne licgean þær he longe wæs, wicum wunian oð woruldende; heold on heahgesceap.', 'Hord ys gesceawod, grimme gegongen; wæs þæt gifeðe to swið þe ðone þeodcyning þyder ontyhte.', 'Ic wæs þær inne ond þæt eall geondseh, recedes geatwa, þa me gerymed wæs, nealles swæslice sið alyfed inn under eorðweall.', 'Ic on ofoste gefeng micle mid mundum mægenbyrðenne hordgestreona, hider ut ætbær cyninge minum.', 'Cwico wæs þa gena, wis ond gewittig; worn eall gespræc gomol on gehðo ond eowic gretan het, bæd þæt ge geworhton æfter wines dædum in bælstede beorh þone hean, micelne ond mærne, swa he manna wæs wigend weorðfullost wide geond eorðan, þenden he burhwelan brucan moste.', 'Uton nu efstan oðre siðe, seon ond secean searogimma geþræc, wundur under wealle; ic eow wisige, þæt ge genoge neon sceawiað beagas ond brad gold.', 'Sie sio bær gearo, ædre geæfned, þonne we ut cymen, ond þonne geferian frean userne, leofne mannan, þær he longe sceal on ðæs waldendes wære geþolian.\" Het ða gebeodan byre Wihstanes, hæle hildedior, hæleða monegum, boldagendra, þæt hie bælwudu feorran feredon, folcagende, godum togenes: \"Nu sceal gled fretan, weaxan wonna leg wigena strengel, þone ðe oft gebad isernscure, þonne stræla storm strengum gebæded scoc ofer scildweall, sceft nytte heold, feðergearwum fus flane fulleode.\" Huru se snotra sunu Wihstanes acigde of corðre cyninges þegnas syfone tosomne, þa selestan, eode eahta sum under inwithrof hilderinca; sum on handa bær æledleoman, se ðe on orde geong.', 'Næs ða on hlytme hwa þæt hord strude, syððan orwearde ænigne dæl secgas gesegon on sele wunian, læne licgan; lyt ænig mearn þæt hi ofostlice ut geferedon dyre maðmas.', 'Dracan ec scufun, wyrm ofer weallclif, leton weg niman, flod fæðmian frætwa hyrde.', 'Þa wæs wunden gold on wæn hladen, æghwæs unrim, æþeling boren, har hilderinc to Hronesnæsse.', 'Him ða gegiredan Geata leode ad on eorðan unwaclicne, helmum behongen, hildebordum, beorhtum byrnum, swa he bena wæs; alegdon ða tomiddes mærne þeoden hæleð hiofende, hlaford leofne.', 'Ongunnon þa on beorge bælfyra mæst wigend weccan; wudurec astah, sweart ofer swioðole, swogende leg wope bewunden (windblond gelæg), oðþæt he ða banhus gebrocen hæfde, hat on hreðre.', 'Higum unrote modceare mændon, mondryhtnes cwealm; swylce giomorgyd Geatisc meowle bundenheorde song sorgcearig swiðe geneahhe þæt hio hyre heofungdagas hearde ondrede, wælfylla worn, werudes egesan, hynðo ond hæftnyd.', 'Heofon rece swealg.', 'Geworhton ða Wedra leode hleo on hoe, se wæs heah ond brad, wægliðendum wide gesyne, ond betimbredon on tyn dagum beadurofes becn, bronda lafe wealle beworhton, swa hyt weorðlicost foresnotre men findan mihton.', 'Hi on beorg dydon beg ond siglu, eall swylce hyrsta, swylce on horde ær niðhedige men genumen hæfdon, forleton eorla gestreon eorðan healdan, gold on greote, þær hit nu gen lifað eldum swa unnyt swa hit æror wæs.', 'Þa ymbe hlæw riodan hildediore, æþelinga bearn, ealra twelfe, woldon ceare cwiðan ond kyning mænan, wordgyd wrecan ond ymb wer sprecan; eahtodan eorlscipe ond his ellenweorc duguðum demdon, swa hit gedefe bið þæt mon his winedryhten wordum herge, ferhðum freoge, þonne he forð scile of lichaman læded weorðan.', 'Swa begnornodon Geata leode hlafordes hryre, heorðgeneatas, cwædon þæt he wære wyruldcyninga manna mildust ond monðwærust, leodum liðost ond lofgeornost.']);
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0;
		return function (seed) {
			var _v1 = genA(seed);
			var result = _v1.a;
			var newSeed = _v1.b;
			var _v2 = callback(result);
			var genB = _v2;
			return genB(newSeed);
		};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$random$Random$constant = function (value) {
	return function (seed) {
		return _Utils_Tuple2(value, seed);
	};
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$random_extra$Random$List$get = F2(
	function (index, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, index, list));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$random_extra$Random$List$choose = function (list) {
	if ($elm$core$List$isEmpty(list)) {
		return $elm$random$Random$constant(
			_Utils_Tuple2($elm$core$Maybe$Nothing, list));
	} else {
		var lastIndex = $elm$core$List$length(list) - 1;
		var gen = A2($elm$random$Random$int, 0, lastIndex);
		var front = function (i) {
			return A2($elm$core$List$take, i, list);
		};
		var back = function (i) {
			return A2($elm$core$List$drop, i + 1, list);
		};
		return A2(
			$elm$random$Random$map,
			function (index) {
				return _Utils_Tuple2(
					A2($elm_community$random_extra$Random$List$get, index, list),
					A2(
						$elm$core$List$append,
						front(index),
						back(index)));
			},
			gen);
	}
};
var $elm$random$Random$lazy = function (callback) {
	return function (seed) {
		var _v0 = callback(0);
		var gen = _v0;
		return gen(seed);
	};
};
var $elm_community$random_extra$Random$List$choices = F2(
	function (count, list) {
		return (count < 1) ? $elm$random$Random$constant(
			_Utils_Tuple2(_List_Nil, list)) : A2(
			$elm$random$Random$andThen,
			function (_v0) {
				var choice = _v0.a;
				var remaining = _v0.b;
				var genRest = $elm$random$Random$lazy(
					function (_v3) {
						return A2($elm_community$random_extra$Random$List$choices, count - 1, remaining);
					});
				var addToChoices = F2(
					function (elem, _v2) {
						var chosen = _v2.a;
						var unchosen = _v2.b;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, elem, chosen),
							unchosen);
					});
				if (choice.$ === 1) {
					return $elm$random$Random$constant(
						_Utils_Tuple2(_List_Nil, list));
				} else {
					var elem = choice.a;
					return A2(
						$elm$random$Random$map,
						addToChoices(elem),
						genRest);
				}
			},
			$elm_community$random_extra$Random$List$choose(list));
	});
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0;
		var genB = _v1;
		return function (seed0) {
			var _v2 = genA(seed0);
			var a = _v2.a;
			var seed1 = _v2.b;
			var _v3 = genB(seed1);
			var b = _v3.a;
			var seed2 = _v3.b;
			return _Utils_Tuple2(
				A2(func, a, b),
				seed2);
		};
	});
var $elm_community$random_extra$Random$Extra$sequence = A2(
	$elm$core$List$foldr,
	$elm$random$Random$map2($elm$core$List$cons),
	$elm$random$Random$constant(_List_Nil));
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		update:
		while (true) {
			switch (msg.$) {
				case 0:
					var genParagraphs = $elm_community$random_extra$Random$Extra$sequence(
						A2(
							$elm$core$List$repeat,
							model.A,
							A2($elm_community$random_extra$Random$List$choices, model.B, $author$project$Beowulf$beowulf)));
					return _Utils_Tuple2(
						model,
						A2($elm$random$Random$generate, $author$project$Main$NewText, genParagraphs));
				case 1:
					var t = msg.a;
					var v = msg.b;
					var val = A2(
						$elm$core$Maybe$withDefault,
						0,
						$elm$core$String$toInt(v));
					var newModel = function () {
						if (!t) {
							return _Utils_update(
								model,
								{B: val});
						} else {
							return _Utils_update(
								model,
								{A: val});
						}
					}();
					var $temp$msg = $author$project$Main$Gen,
						$temp$model = newModel;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
				default:
					var r = msg.a;
					var hwaet = function (paragraphs) {
						if (!paragraphs.b) {
							return _List_Nil;
						} else {
							var h = paragraphs.a;
							var t = paragraphs.b;
							return A2($elm$core$List$cons, 'Hwæt! ' + h, t);
						}
					};
					var flattenedPargraphs = A2(
						$elm$core$List$map,
						$elm$core$String$join(' '),
						A2($elm$core$List$map, $elm$core$Tuple$first, r));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								M: hwaet(flattenedPargraphs)
							}),
						$elm$core$Platform$Cmd$none);
			}
		}
	});
var $author$project$Main$init = function (_v0) {
	return A2(
		$author$project$Main$update,
		$author$project$Main$Gen,
		A3($author$project$Main$Model, _List_Nil, 3, 2));
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Main$Paragraphs = 1;
var $author$project$Main$Sentences = 0;
var $author$project$Main$Update = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$view = function (model) {
	var textView = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('text')
			]),
		A2(
			$elm$core$List$map,
			function (y) {
				return A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(y)
						]));
			},
			model.M));
	var header = A2(
		$elm$html$Html$h1,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text('Hwæt :: Old English Lorem Ipsum')
			]));
	var footer = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('footer')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href('https://github.com/autophagy/hwaet')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('src')
					]))
			]));
	var controlsView = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('controls')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('range'),
								$elm$html$Html$Attributes$min('1'),
								$elm$html$Html$Attributes$max('5'),
								$elm$html$Html$Attributes$value(
								$elm$core$String$fromInt(model.A)),
								$elm$html$Html$Events$onInput(
								$author$project$Main$Update(1))
							]),
						_List_Nil),
						$elm$html$Html$text(
						'Paragraphs :: ' + $elm$core$String$fromInt(model.A))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('range'),
								$elm$html$Html$Attributes$min('1'),
								$elm$html$Html$Attributes$max('10'),
								$elm$html$Html$Attributes$value(
								$elm$core$String$fromInt(model.B)),
								$elm$html$Html$Events$onInput(
								$author$project$Main$Update(0))
							]),
						_List_Nil),
						$elm$html$Html$text(
						'Sentences :: ' + $elm$core$String$fromInt(model.B))
					]))
			]));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('hwaet')
			]),
		_List_fromArray(
			[header, controlsView, textView, footer]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{aw: $author$project$Main$init, aC: $author$project$Main$subscriptions, aE: $author$project$Main$update, aF: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));