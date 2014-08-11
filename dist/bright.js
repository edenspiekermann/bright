(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Bright"] = factory();
	else
		root["Bright"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);

	var Emitter = __webpack_require__(3);
	var assign = __webpack_require__(4);

	var createObjectTag = __webpack_require__(2);

	var uniqueId = 0;
	var loadHandlers = {};

	var defaults = {
		isVid: true, // required for all video players (totally nonsense by brightcove)
		isUI: true,
		includeAPI: true, // enable brightcove’s HTML5 "smart" player
		wmode: 'transparent', // transparent backbround color for flash player
		bgcolor: '#FFFFFF', // the players background color
		showNoContentMessage: false, // hide error message if no video is loaded
		templateLoadHandler: 'brightcove.brightTemplateLoadHandler'
	};

	function Bright(options) {

		var emitter = Emitter();

		options = assign({}, defaults, options);

	  var player;
		var playerId = 'bright'+(uniqueId++);
		loadHandlers[playerId] = loadHandler;

		var bright = Object.freeze({
			load: load,
			on: emitter.on,
			once: emitter.once,
			off: emitter.off
		});

		init();

		function init() {
			if (!options.element) throw new Error('(bright) missing element in options');
			if (!options.player)  throw new Error('(bright) missing player (playerKey) in options');
			if (!options.video)   throw new Error('(bright) missing video in options');

			options["@videoPlayer"] = options.video;
			options.playerKey = options.player;

			var object = createObjectTag(options);
			object.id = playerId;
			options.element.innerHTML = '';

			window.brightcove.createExperience(object, options.element, true);
		}

		function load(video) {
			options.video = video;
			options["@videoPlayer"] = options.video;

			if (typeof video === 'string') player.loadVideoByReferenceID(video);
			if (typeof video === 'number') player.loadVideoByID(video);
		}

		function loadHandler() {
		  var brightcoveAPI = window.brightcove.api;
		  var brightcoveEvent = brightcoveAPI.events.MediaEvent;
		  var experience = brightcoveAPI.getExperience(playerId);

		  player = experience.getModule(brightcoveAPI.modules.APIModules.VIDEO_PLAYER);

		  player.addEventListener(brightcoveEvent.CHANGE, trigger('load', bright));
		  player.addEventListener(brightcoveEvent.PLAY, trigger('play', bright));
		  player.addEventListener(brightcoveEvent.STOP, trigger('pause', bright));
		  player.addEventListener(brightcoveEvent.COMPLETE, trigger('end', bright));
		}

		function trigger() {
			var args = arguments;
			return function() {
		  	emitter.trigger.apply(null, args);
			};
		}

		return bright;
	}

	window.brightcove.brightTemplateLoadHandler = function(playerId) {
		loadHandlers[playerId]();
	};

	module.exports = Bright;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// This prevents throwing an error if code with Object.freeze is executed in Browsers
	// that don’t support it.
	// Note that this code returns the object without freezing it.

	if (!Object.freeze) {
	  Object.prototype.freeze = function(object) {
	    return object;
	  };
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	function createObjectTag(options) {
	  var object = document.createElement('object');
	  for (var param in options) object.appendChild(createParam(param, options[param]));
	  return object;
	}

	function createParam(name, value) {
	  var param = document.createElement('param');
	  param.name = name;
	  param.value = value;
	  return param;
	}

	module.exports = createObjectTag;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	function Emitter() {
	  var listeners = {};

	  var emitter = Object.freeze({
	    on: on,
	    off: off,
	    trigger: trigger,
	    hasListeners: hasListeners,
	    once: once
	  });
	  return emitter;

	  function on(event, listener) {
	    if (!listeners[event]) listeners[event] = [];
	    listeners[event].push(listener);
	  }

	  function off(event, listener) {
	    if (!arguments.length) {
	      listeners = {};
	    }

	    var specificListeners = listeners[event];
	    if (!specificListeners) return;

	    if (arguments.length === 1) {
	      delete listeners[event];
	    }

	    specificListeners.some(function(specificListener, index) {
	      if (specificListener !== listener && specificListener.listener !== listener) return;
	      specificListeners.splice(index, 1);
	      return true;
	    });

	  }

	  function trigger(event) {
	    var args = [].slice.call(arguments, 1);
	    var specificListeners = listeners[event];

	    if (!specificListeners) return;

	    specificListeners = specificListeners.slice(0);
	    specificListeners.forEach(function(listener) {
	      listener.apply(null, args);
	    });

	  }

	  function hasListeners(event) {
	    if (!arguments.length) return !!Object.keys(listeners).length;
	    return !!(listeners[event] && listeners[event].length);
	  }

	  function once(event, listener) {
	    function removeItself() {
	      emitter.off(event, removeItself);
	      listener.apply(null, arguments);
	    }

	    removeItself.listener = listener;
	    emitter.on(event, removeItself);
	  }
	}

	module.exports = Emitter;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var baseCreateCallback = __webpack_require__(6),
	    keys = __webpack_require__(5),
	    objectTypes = __webpack_require__(7);

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources will overwrite property assignments of previous
	 * sources. If a callback is provided it will be executed to produce the
	 * assigned values. The callback is bound to `thisArg` and invoked with two
	 * arguments; (objectValue, sourceValue).
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @alias extend
	 * @category Objects
	 * @param {Object} object The destination object.
	 * @param {...Object} [source] The source objects.
	 * @param {Function} [callback] The function to customize assigning values.
	 * @param {*} [thisArg] The `this` binding of `callback`.
	 * @returns {Object} Returns the destination object.
	 * @example
	 *
	 * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
	 * // => { 'name': 'fred', 'employer': 'slate' }
	 *
	 * var defaults = _.partialRight(_.assign, function(a, b) {
	 *   return typeof a == 'undefined' ? b : a;
	 * });
	 *
	 * var object = { 'name': 'barney' };
	 * defaults(object, { 'name': 'fred', 'employer': 'slate' });
	 * // => { 'name': 'barney', 'employer': 'slate' }
	 */
	var assign = function(object, source, guard) {
	  var index, iterable = object, result = iterable;
	  if (!iterable) return result;
	  var args = arguments,
	      argsIndex = 0,
	      argsLength = typeof guard == 'number' ? 2 : args.length;
	  if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
	    var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
	  } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
	    callback = args[--argsLength];
	  }
	  while (++argsIndex < argsLength) {
	    iterable = args[argsIndex];
	    if (iterable && objectTypes[typeof iterable]) {
	    var ownIndex = -1,
	        ownProps = objectTypes[typeof iterable] && keys(iterable),
	        length = ownProps ? ownProps.length : 0;

	    while (++ownIndex < length) {
	      index = ownProps[ownIndex];
	      result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
	    }
	    }
	  }
	  return result
	};

	module.exports = assign;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var isNative = __webpack_require__(8),
	    isObject = __webpack_require__(9),
	    shimKeys = __webpack_require__(10);

	/* Native method shortcuts for methods with the same name as other `lodash` methods */
	var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

	/**
	 * Creates an array composed of the own enumerable property names of an object.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns an array of property names.
	 * @example
	 *
	 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
	 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  if (!isObject(object)) {
	    return [];
	  }
	  return nativeKeys(object);
	};

	module.exports = keys;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var bind = __webpack_require__(13),
	    identity = __webpack_require__(14),
	    setBindData = __webpack_require__(11),
	    support = __webpack_require__(12);

	/** Used to detected named functions */
	var reFuncName = /^\s*function[ \n\r\t]+\w/;

	/** Used to detect functions containing a `this` reference */
	var reThis = /\bthis\b/;

	/** Native method shortcuts */
	var fnToString = Function.prototype.toString;

	/**
	 * The base implementation of `_.createCallback` without support for creating
	 * "_.pluck" or "_.where" style callbacks.
	 *
	 * @private
	 * @param {*} [func=identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of the created callback.
	 * @param {number} [argCount] The number of arguments the callback accepts.
	 * @returns {Function} Returns a callback function.
	 */
	function baseCreateCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  // exit early for no `thisArg` or already bound by `Function#bind`
	  if (typeof thisArg == 'undefined' || !('prototype' in func)) {
	    return func;
	  }
	  var bindData = func.__bindData__;
	  if (typeof bindData == 'undefined') {
	    if (support.funcNames) {
	      bindData = !func.name;
	    }
	    bindData = bindData || !support.funcDecomp;
	    if (!bindData) {
	      var source = fnToString.call(func);
	      if (!support.funcNames) {
	        bindData = !reFuncName.test(source);
	      }
	      if (!bindData) {
	        // checks if `func` references the `this` keyword and stores the result
	        bindData = reThis.test(source);
	        setBindData(func, bindData);
	      }
	    }
	  }
	  // exit early if there are no `this` references or `func` is bound
	  if (bindData === false || (bindData !== true && bindData[1] & 1)) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 2: return function(a, b) {
	      return func.call(thisArg, a, b);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	  }
	  return bind(func, thisArg);
	}

	module.exports = baseCreateCallback;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */

	/** Used to determine if values are of the language type Object */
	var objectTypes = {
	  'boolean': false,
	  'function': true,
	  'object': true,
	  'number': false,
	  'string': false,
	  'undefined': false
	};

	module.exports = objectTypes;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */

	/** Used for native method references */
	var objectProto = Object.prototype;

	/** Used to resolve the internal [[Class]] of values */
	var toString = objectProto.toString;

	/** Used to detect if a method is native */
	var reNative = RegExp('^' +
	  String(toString)
	    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	    .replace(/toString| for [^\]]+/g, '.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
	 */
	function isNative(value) {
	  return typeof value == 'function' && reNative.test(value);
	}

	module.exports = isNative;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var objectTypes = __webpack_require__(7);

	/**
	 * Checks if `value` is the language type of Object.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // check if the value is the ECMAScript language type of Object
	  // http://es5.github.io/#x8
	  // and avoid a V8 bug
	  // http://code.google.com/p/v8/issues/detail?id=2291
	  return !!(value && objectTypes[typeof value]);
	}

	module.exports = isObject;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var objectTypes = __webpack_require__(7);

	/** Used for native method references */
	var objectProto = Object.prototype;

	/** Native method shortcuts */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A fallback implementation of `Object.keys` which produces an array of the
	 * given object's own enumerable property names.
	 *
	 * @private
	 * @type Function
	 * @param {Object} object The object to inspect.
	 * @returns {Array} Returns an array of property names.
	 */
	var shimKeys = function(object) {
	  var index, iterable = object, result = [];
	  if (!iterable) return result;
	  if (!(objectTypes[typeof object])) return result;
	    for (index in iterable) {
	      if (hasOwnProperty.call(iterable, index)) {
	        result.push(index);
	      }
	    }
	  return result
	};

	module.exports = shimKeys;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var isNative = __webpack_require__(8),
	    noop = __webpack_require__(15);

	/** Used as the property descriptor for `__bindData__` */
	var descriptor = {
	  'configurable': false,
	  'enumerable': false,
	  'value': null,
	  'writable': false
	};

	/** Used to set meta data on functions */
	var defineProperty = (function() {
	  // IE 8 only accepts DOM elements
	  try {
	    var o = {},
	        func = isNative(func = Object.defineProperty) && func,
	        result = func(o, o, o) && func;
	  } catch(e) { }
	  return result;
	}());

	/**
	 * Sets `this` binding data on a given function.
	 *
	 * @private
	 * @param {Function} func The function to set data on.
	 * @param {Array} value The data array to set.
	 */
	var setBindData = !defineProperty ? noop : function(func, value) {
	  descriptor.value = value;
	  defineProperty(func, '__bindData__', descriptor);
	};

	module.exports = setBindData;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var isNative = __webpack_require__(8);

	/** Used to detect functions containing a `this` reference */
	var reThis = /\bthis\b/;

	/**
	 * An object used to flag environments features.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};

	/**
	 * Detect if functions can be decompiled by `Function#toString`
	 * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
	 *
	 * @memberOf _.support
	 * @type boolean
	 */
	support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });

	/**
	 * Detect if `Function#name` is supported (all but IE).
	 *
	 * @memberOf _.support
	 * @type boolean
	 */
	support.funcNames = typeof Function.name == 'string';

	module.exports = support;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var createWrapper = __webpack_require__(16),
	    slice = __webpack_require__(17);

	/**
	 * Creates a function that, when called, invokes `func` with the `this`
	 * binding of `thisArg` and prepends any additional `bind` arguments to those
	 * provided to the bound function.
	 *
	 * @static
	 * @memberOf _
	 * @category Functions
	 * @param {Function} func The function to bind.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {...*} [arg] Arguments to be partially applied.
	 * @returns {Function} Returns the new bound function.
	 * @example
	 *
	 * var func = function(greeting) {
	 *   return greeting + ' ' + this.name;
	 * };
	 *
	 * func = _.bind(func, { 'name': 'fred' }, 'hi');
	 * func();
	 * // => 'hi fred'
	 */
	function bind(func, thisArg) {
	  return arguments.length > 2
	    ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
	    : createWrapper(func, 1, null, null, thisArg);
	}

	module.exports = bind;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'name': 'fred' };
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = identity;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */

	/**
	 * A no-operation function.
	 *
	 * @static
	 * @memberOf _
	 * @category Utilities
	 * @example
	 *
	 * var object = { 'name': 'fred' };
	 * _.noop(object) === undefined;
	 * // => true
	 */
	function noop() {
	  // no operation performed
	}

	module.exports = noop;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var baseBind = __webpack_require__(18),
	    baseCreateWrapper = __webpack_require__(19),
	    isFunction = __webpack_require__(20),
	    slice = __webpack_require__(17);

	/**
	 * Used for `Array` method references.
	 *
	 * Normally `Array.prototype` would suffice, however, using an array literal
	 * avoids issues in Narwhal.
	 */
	var arrayRef = [];

	/** Native method shortcuts */
	var push = arrayRef.push,
	    unshift = arrayRef.unshift;

	/**
	 * Creates a function that, when called, either curries or invokes `func`
	 * with an optional `this` binding and partially applied arguments.
	 *
	 * @private
	 * @param {Function|string} func The function or method name to reference.
	 * @param {number} bitmask The bitmask of method flags to compose.
	 *  The bitmask may be composed of the following flags:
	 *  1 - `_.bind`
	 *  2 - `_.bindKey`
	 *  4 - `_.curry`
	 *  8 - `_.curry` (bound)
	 *  16 - `_.partial`
	 *  32 - `_.partialRight`
	 * @param {Array} [partialArgs] An array of arguments to prepend to those
	 *  provided to the new function.
	 * @param {Array} [partialRightArgs] An array of arguments to append to those
	 *  provided to the new function.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [arity] The arity of `func`.
	 * @returns {Function} Returns the new function.
	 */
	function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
	  var isBind = bitmask & 1,
	      isBindKey = bitmask & 2,
	      isCurry = bitmask & 4,
	      isCurryBound = bitmask & 8,
	      isPartial = bitmask & 16,
	      isPartialRight = bitmask & 32;

	  if (!isBindKey && !isFunction(func)) {
	    throw new TypeError;
	  }
	  if (isPartial && !partialArgs.length) {
	    bitmask &= ~16;
	    isPartial = partialArgs = false;
	  }
	  if (isPartialRight && !partialRightArgs.length) {
	    bitmask &= ~32;
	    isPartialRight = partialRightArgs = false;
	  }
	  var bindData = func && func.__bindData__;
	  if (bindData && bindData !== true) {
	    // clone `bindData`
	    bindData = slice(bindData);
	    if (bindData[2]) {
	      bindData[2] = slice(bindData[2]);
	    }
	    if (bindData[3]) {
	      bindData[3] = slice(bindData[3]);
	    }
	    // set `thisBinding` is not previously bound
	    if (isBind && !(bindData[1] & 1)) {
	      bindData[4] = thisArg;
	    }
	    // set if previously bound but not currently (subsequent curried functions)
	    if (!isBind && bindData[1] & 1) {
	      bitmask |= 8;
	    }
	    // set curried arity if not yet set
	    if (isCurry && !(bindData[1] & 4)) {
	      bindData[5] = arity;
	    }
	    // append partial left arguments
	    if (isPartial) {
	      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
	    }
	    // append partial right arguments
	    if (isPartialRight) {
	      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
	    }
	    // merge flags
	    bindData[1] |= bitmask;
	    return createWrapper.apply(null, bindData);
	  }
	  // fast path for `_.bind`
	  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
	  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
	}

	module.exports = createWrapper;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */

	/**
	 * Slices the `collection` from the `start` index up to, but not including,
	 * the `end` index.
	 *
	 * Note: This function is used instead of `Array#slice` to support node lists
	 * in IE < 9 and to ensure dense arrays are returned.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to slice.
	 * @param {number} start The start index.
	 * @param {number} end The end index.
	 * @returns {Array} Returns the new array.
	 */
	function slice(array, start, end) {
	  start || (start = 0);
	  if (typeof end == 'undefined') {
	    end = array ? array.length : 0;
	  }
	  var index = -1,
	      length = end - start || 0,
	      result = Array(length < 0 ? 0 : length);

	  while (++index < length) {
	    result[index] = array[start + index];
	  }
	  return result;
	}

	module.exports = slice;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var baseCreate = __webpack_require__(21),
	    isObject = __webpack_require__(9),
	    setBindData = __webpack_require__(11),
	    slice = __webpack_require__(17);

	/**
	 * Used for `Array` method references.
	 *
	 * Normally `Array.prototype` would suffice, however, using an array literal
	 * avoids issues in Narwhal.
	 */
	var arrayRef = [];

	/** Native method shortcuts */
	var push = arrayRef.push;

	/**
	 * The base implementation of `_.bind` that creates the bound function and
	 * sets its meta data.
	 *
	 * @private
	 * @param {Array} bindData The bind data array.
	 * @returns {Function} Returns the new bound function.
	 */
	function baseBind(bindData) {
	  var func = bindData[0],
	      partialArgs = bindData[2],
	      thisArg = bindData[4];

	  function bound() {
	    // `Function#bind` spec
	    // http://es5.github.io/#x15.3.4.5
	    if (partialArgs) {
	      // avoid `arguments` object deoptimizations by using `slice` instead
	      // of `Array.prototype.slice.call` and not assigning `arguments` to a
	      // variable as a ternary expression
	      var args = slice(partialArgs);
	      push.apply(args, arguments);
	    }
	    // mimic the constructor's `return` behavior
	    // http://es5.github.io/#x13.2.2
	    if (this instanceof bound) {
	      // ensure `new bound` is an instance of `func`
	      var thisBinding = baseCreate(func.prototype),
	          result = func.apply(thisBinding, args || arguments);
	      return isObject(result) ? result : thisBinding;
	    }
	    return func.apply(thisArg, args || arguments);
	  }
	  setBindData(bound, bindData);
	  return bound;
	}

	module.exports = baseBind;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var baseCreate = __webpack_require__(21),
	    isObject = __webpack_require__(9),
	    setBindData = __webpack_require__(11),
	    slice = __webpack_require__(17);

	/**
	 * Used for `Array` method references.
	 *
	 * Normally `Array.prototype` would suffice, however, using an array literal
	 * avoids issues in Narwhal.
	 */
	var arrayRef = [];

	/** Native method shortcuts */
	var push = arrayRef.push;

	/**
	 * The base implementation of `createWrapper` that creates the wrapper and
	 * sets its meta data.
	 *
	 * @private
	 * @param {Array} bindData The bind data array.
	 * @returns {Function} Returns the new function.
	 */
	function baseCreateWrapper(bindData) {
	  var func = bindData[0],
	      bitmask = bindData[1],
	      partialArgs = bindData[2],
	      partialRightArgs = bindData[3],
	      thisArg = bindData[4],
	      arity = bindData[5];

	  var isBind = bitmask & 1,
	      isBindKey = bitmask & 2,
	      isCurry = bitmask & 4,
	      isCurryBound = bitmask & 8,
	      key = func;

	  function bound() {
	    var thisBinding = isBind ? thisArg : this;
	    if (partialArgs) {
	      var args = slice(partialArgs);
	      push.apply(args, arguments);
	    }
	    if (partialRightArgs || isCurry) {
	      args || (args = slice(arguments));
	      if (partialRightArgs) {
	        push.apply(args, partialRightArgs);
	      }
	      if (isCurry && args.length < arity) {
	        bitmask |= 16 & ~32;
	        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
	      }
	    }
	    args || (args = arguments);
	    if (isBindKey) {
	      func = thisBinding[key];
	    }
	    if (this instanceof bound) {
	      thisBinding = baseCreate(func.prototype);
	      var result = func.apply(thisBinding, args);
	      return isObject(result) ? result : thisBinding;
	    }
	    return func.apply(thisBinding, args);
	  }
	  setBindData(bound, bindData);
	  return bound;
	}

	module.exports = baseCreateWrapper;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */

	/**
	 * Checks if `value` is a function.
	 *
	 * @static
	 * @memberOf _
	 * @category Objects
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 */
	function isFunction(value) {
	  return typeof value == 'function';
	}

	module.exports = isFunction;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash modularize modern exports="node" -o ./modern/`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	var isNative = __webpack_require__(8),
	    isObject = __webpack_require__(9),
	    noop = __webpack_require__(15);

	/* Native method shortcuts for methods with the same name as other `lodash` methods */
	var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} prototype The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	function baseCreate(prototype, properties) {
	  return isObject(prototype) ? nativeCreate(prototype) : {};
	}
	// fallback for browsers without `Object.create`
	if (!nativeCreate) {
	  baseCreate = (function() {
	    function Object() {}
	    return function(prototype) {
	      if (isObject(prototype)) {
	        Object.prototype = prototype;
	        var result = new Object;
	        Object.prototype = null;
	      }
	      return result || global.Object();
	    };
	  }());
	}

	module.exports = baseCreate;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
})
