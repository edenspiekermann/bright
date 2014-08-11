require('./helpers/object-freeze-sham');

var Emitter = require('maxhoffmann-emitter');
var assign = require('lodash-node/modern/objects/assign');

var createObjectTag = require('./helpers/createObjectTag');

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
	  player.addEventListener(brightcoveEvent.COMPLETE, trigger('ended', bright));
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
