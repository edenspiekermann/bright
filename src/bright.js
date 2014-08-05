require('./helpers/object-freeze-sham');

var Emitter = require('maxhoffmann-emitter');
var assign = require('lodash-node/modern/objects/assign');

var createObjectTag = require('./helpers/createObjectTag');

var uniqueId = 0;
var readyHandlers = {};
var loadHandlers = {};
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
	  player.addEventListener(brightcoveEvent.CHANGE, trigger('load', bright));
	  player.addEventListener(brightcoveEvent.PLAY, trigger('play', bright));
	  player.addEventListener(brightcoveEvent.STOP, trigger('pause', bright));
	  player.addEventListener(brightcoveEvent.COMPLETE, trigger('ended', bright));
	  emitter.trigger('init', bright);
	}

	function trigger() {
		var args = arguments;
		return function() {
	  	emitter.trigger.apply(null, args);
		};
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

if (typeof window.__brightcoveTemplateHandlers !== 'undefined') {
	var message = 'global variable __brightcoveTemplateHandlers is already defined. ';
		 message += 'Did you load "bright" more than once?';
	throw new Error(message);
}

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
