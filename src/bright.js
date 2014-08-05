var assign = require('lodash-node/modern/objects/assign');
var Emitter = require('maxhoffmann-emitter');
require('./object-freeze-sham');

var uniquePlayerId = 0;
var defaults = {
	isVid: true,
	isUI: true,
	includeAPI: true,
	wmode: 'transparent',
	bgcolor: '#ffffff',
	templateLoadHandler: '__brightHandlers.load',
	templateReadyHandler: '__brightHandlers.ready'
};

function Bright(element, options) {

	var emitter = Emitter();

	options = assign({}, defaults, options);

	var id = 'bright'+(uniquePlayerId++);
	loadHandlers[id] = loadHandler;
	readyHandlers[id] = readyHandler;
  var player;

	var bright = Object.freeze({
		init: init,
		load: load,
		play: play,
		pause: pause,
		on: emitter.on,
		once: emitter.once,
		off: emitter.off
	});
	return bright;

	function init() {
		var object = createObjectTag(options);
		object.id = id;
		element.innerHTML = '';

		window.brightcove.createExperience(object, element, true);
	}

	function loadHandler() {
	  var brightcoveAPI = window.brightcove.api;
	  var experience = brightcoveAPI.getExperience(id);
	  player = experience.getModule(brightcoveAPI.modules.APIModules.VIDEO_PLAYER);
	  emitter.trigger('init', bright);
	}

	function readyHandler() {
		var brightcoveEvent = window.brightcove.api.events.MediaEvent;
	  player.addEventListener(brightcoveEvent.CHANGE, emitter.trigger.bind(null, 'load', bright));
	  player.addEventListener(brightcoveEvent.PLAY, emitter.trigger.bind(null, 'play', bright));
	  player.addEventListener(brightcoveEvent.STOP, emitter.trigger.bind(null, 'pause', bright));
	  player.addEventListener(brightcoveEvent.COMPLETE, emitter.trigger.bind(null, 'ended', bright));
	}

	function load(videoId) {
		if (!videoId) throw new Error('missing video id');

		var brightcoveMethod = 'cueVideoByID';
		if (typeof videoId === 'string') {
				brightcoveMethod = 'cueVideoByReferenceID';
		}

		player[brightcoveMethod](videoId);
	}

	function play(videoId) {
		var brightcoveMethod = 'play';
		if (typeof videoId === 'number') brightcoveMethod = 'loadVideoByID';
		if (typeof videoId === 'string') brightcoveMethod = 'loadVideoByReferenceID';

		setTimeout(function() {
			player[brightcoveMethod](videoId);
		});
	}

	function pause() {
		player.pause();
	}
}

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

if (typeof window.__brightHandlers !== 'undefined') {
	throw new Error('global variable __brightHandlers is already defined');
}

var readyHandlers = {};
var loadHandlers = {};

window.__brightHandlers = {
	ready: function(event) {
		readyHandlers[event.target.experience.id]();
	},
	load: function(id) {
		loadHandlers[id]();
	}
};

module.exports = Bright;
