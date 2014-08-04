var assign = require('lodash-node/modern/objects/assign');
var Emitter = require('maxhoffmann-emitter');

var uniqueId = 0;
var readyHandlers = {};
var loadHandlers = {};

if (typeof window.bright !== 'undefined') throw new Error('bright is already defined');
window.__brightHandlers = {
	ready: function(event) {
		readyHandlers[event.target.experience.id]();
	},
	load: function(id) {
		loadHandlers[id]();
	}
};

function Bright(element, options) {

	var defaults = {
		isVid: true,
		isUI: true,
		includeAPI: true,
		wmode: 'transparent',
		bgcolor: '#ffffff',
		templateLoadHandler: '__brightHandlers.load',
		templateReadyHandler: '__brightHandlers.ready'
	};
	options = assign({}, defaults, options);

  var emitter = Emitter();

	var id = 'bright'+(++uniqueId);
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
		player.cueVideoByID(videoId);
	}

	function play(videoId) {
		var method = 'play';
		if (videoId) {
			method = 'loadVideoByID';
		}
		setTimeout(function() {
			player[method](videoId);
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

module.exports = Bright;
