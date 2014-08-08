require('./helpers/object-freeze-sham');

var Emitter = require('maxhoffmann-emitter');
var assign = require('lodash-node/modern/objects/assign');

var createObjectTag = require('./helpers/createObjectTag');

var uniqueId = 0;
var readyHandlers = {};
var loadHandlers = {};
var isPlayerReady = {};
var defaults = {
	isVid: true, // required for all video players (totally nonsense by brightcove)
	isUI: true,
	includeAPI: true, // enable HTML5 "smart" player
	wmode: 'transparent', // transparent backbround color for flash player
	bgcolor: '#FFFFFF', // the players background color
	showNoContentMessage: false, // hide error message if no video is loaded
	templateLoadHandler: '__brightcoveTemplateHandlers.load',
	templateReadyHandler: '__brightcoveTemplateHandlers.ready',
	templateErrorHandler: '__brightcoveTemplateHandlers.error'
};

function Bright(element, options) {

	var emitter = Emitter();

	options = assign({}, defaults, options);

  var player;
	var playerId = 'bright'+(uniqueId++);
	loadHandlers[playerId] = loadHandler;
	readyHandlers[playerId] = readyHandler;

	var bright = Object.freeze({
		load: load,
		play: play,
		pause: pause,
		on: emitter.on,
		once: emitter.once,
		off: emitter.off
	});

	function load(videoId) {
		if (!videoId) throw new Error('missing video id');

		options["@videoPlayer"] = videoId;

		var object = createObjectTag(options);
		object.id = playerId;
		element.innerHTML = '';

		window.brightcove.createExperience(object, element, true);
	}

	function loadHandler() {
	  var brightcoveAPI = window.brightcove.api;
	  var brightcoveEvent = brightcoveAPI.events.MediaEvent;
	  var experience = brightcoveAPI.getExperience(playerId);

	  player = experience.getModule(brightcoveAPI.modules.APIModules.VIDEO_PLAYER);

	  player.addEventListener(brightcoveEvent.CHANGE, trigger('load', bright));
	  player.addEventListener(brightcoveEvent.PLAY, trigger('play', bright));
	  player.addEventListener(brightcoveEvent.STOP, trigger('pause', bright));
	  player.addEventListener(brightcoveEvent.COMPLETE, trigger('ended', bright));
	}

	function readyHandler() {
	  emitter.trigger('init', bright);
	}

	function trigger() {
		var args = arguments;
		return function() {
	  	emitter.trigger.apply(null, args);
		};
	}

	function play() {
		player.play();
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
	load: function(playerId) {
		isPlayerReady[playerId] = false;
		loadHandlers[playerId]();
	},
	ready: function(event) {
		var playerId = event.target.experience.id;
		if (isPlayerReady[playerId]) return;
		isPlayerReady[playerId] = true;
		readyHandlers[playerId]();
	},
	error: function(event) {
		var playerId = event.id;
		if (isPlayerReady[playerId]) return;
		if(playerId && event.code === 4) {
			isPlayerReady[playerId] = true;
			readyHandlers[playerId]();
		}
	}
};

module.exports = Bright;
