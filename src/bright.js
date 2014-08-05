var assign = require('lodash-node/modern/objects/assign');
var Emitter = require('maxhoffmann-emitter');
require('./object-freeze-sham');

var uniqueId = 0;
var defaults = {
	isVid: true,
	isUI: true,
	includeAPI: true,
	wmode: 'transparent',
	bgcolor: '#ffffff',
	templateLoadHandler: '__brightcoveTemplateHandlers.load',
	templateReadyHandler: '__brightcoveTemplateHandlers.ready'
};

function Bright(element, options) {

	var emitter = Emitter();

	options = assign({}, defaults, options);

  var player, loadedVideoId;
	var playerId = 'bright'+(uniqueId++);
	loadHandlers[playerId] = loadHandler;
	readyHandlers[playerId] = readyHandler;

	var bright = Object.freeze({
		init: init,
		load: load,
		play: play,
		pause: pause,
		on: emitter.on,
		once: emitter.once,
		off: emitter.off
	});

	bright.on('init', loadLastVideo);

	function init() {
		var object = createObjectTag(options);
		object.id = playerId;
		element.innerHTML = '';

		window.brightcove.createExperience(object, element, true);
	}

	function loadLastVideo() {
		if (player && loadedVideoId) bright.load(loadedVideoId);
	}

	function loadHandler() {
	  var brightcoveAPI = window.brightcove.api;
	  var experience = brightcoveAPI.getExperience(playerId);

	  player = experience.getModule(brightcoveAPI.modules.APIModules.VIDEO_PLAYER);
	}

	function readyHandler() {
		var brightcoveEvent = window.brightcove.api.events.MediaEvent;
	  player.addEventListener(brightcoveEvent.CHANGE, emitter.trigger.bind(null, 'load', bright));
	  player.addEventListener(brightcoveEvent.PLAY, emitter.trigger.bind(null, 'play', bright));
	  player.addEventListener(brightcoveEvent.STOP, emitter.trigger.bind(null, 'pause', bright));
	  player.addEventListener(brightcoveEvent.COMPLETE, emitter.trigger.bind(null, 'ended', bright));
	  emitter.trigger('init', bright);
	}

	function load(videoId) {
		if (!videoId) throw new Error('missing video id');

		var brightcoveMethod = 'cueVideoByID';
		if (typeof videoId === 'string') {
				brightcoveMethod = 'cueVideoByReferenceID';
		}

		player[brightcoveMethod](videoId);
		loadedVideoId = videoId;
	}

	function play(videoId) {
		var brightcoveMethod = 'play';
		if (typeof videoId === 'number') brightcoveMethod = 'loadVideoByID';
		if (typeof videoId === 'string') brightcoveMethod = 'loadVideoByReferenceID';

		setTimeout(function() {
			player[brightcoveMethod](videoId);
			loadedVideoId = videoId;
		});
	}

	function pause() {
		player.pause();
	}

	return bright;
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

if (typeof window.__brightcoveTemplateHandlers !== 'undefined') {
	var message = 'global variable __brightcoveTemplateHandlers is already defined. ';
		 message += 'Did you load "bright" more than once?';
	throw new Error(message);
}

var readyHandlers = {};
var loadHandlers = {};

window.__brightcoveTemplateHandlers = {
	ready: function(event) {
		var playerId = event.target.experience.id;
		readyHandlers[playerId]();
	},
	load: function(playerId) {
		loadHandlers[playerId]();
	}
};

module.exports = Bright;
