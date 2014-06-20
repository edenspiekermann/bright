var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');

var brightcove = {

  defaults: {
    isVid: true,
    isUI: true,
    includeAPI: true,
    wmode: 'transparent',
    bgcolor: '#ffffff',
    templateLoadHandler: 'brightcove.__videoplayerLoad',
    templateReadyHandler: 'brightcove.__videoplayerReady'
  },

  init: function(element, options, emit) {
    this.element = element;
    this.options = assign(this.defaults, options);
    this.emit = emit;

    this.id = this.id || 'brightcove'+getUniqueId();
    var object = createObjectTag(this.element, this.options);
    object.id = this.id;
    this.element.innerHTML = '';
    this.element.appendChild(object);

    loadHandlers[this.id] = bind(loadHandler, this);
    readyHandlers[this.id] = bind(readyHandler, this);

    window.brightcove.createExperience(object, object);
  },

  load: function(videoId) {
    this._loadedVideo = videoId;
    if (!this._isReady) return;
    this.player.cueVideoByID(videoId);
    this.emit.loadstart();
  },

  play: function(videoId) {
    if (!this._isReady) {
      if (videoId) this._loadedVideo = videoId;
      this._shouldPlay = true;
      return;
    }
    this.player.play();
    delete this._shouldPlay;
  },

  pause: function() {
    this.player.pause();
  }

};

var getUniqueId = (function() {
  var id = 0;
  return function() {
    return id++;
  };
})();

function loadHandler() {
  this.api = window.brightcove.api.getExperience(this.id);
  this.player = this.api.getModule(window.brightcove.api.modules.APIModules.VIDEO_PLAYER);
}

function readyHandler() {
  this.player.addEventListener(window.brightcove.api.events.MediaEvent.PLAY, this.emit.play);
  this.player.addEventListener(window.brightcove.api.events.MediaEvent.STOP, this.emit.pause);
  this.player.addEventListener(window.brightcove.api.events.MediaEvent.COMPLETE, this.emit.ended);
  this.emit.init();
  this._isReady = true;
  if (this._loadedVideo) this.load(this._loadedVideo, this.emit.loadstart);
  if (this._shouldPlay) setTimeout(bind(this.play,this), 500);
}

function createObjectTag(element, options) {
  var object = document.createElement('object');
  object.className = "BrightcoveExperience";
  for (var param in options) {
    object.appendChild(createParam(param, options[param]));
  }
  return object;

  function createParam(name, value) {
    var param = document.createElement('param');
    param.name = name;
    param.value = value;
    return param;
  }
}

function brightcoveFactory() {
  return Object.create(brightcove);
}

var readyHandlers = {};
window.brightcove.__videoplayerReady = (function() {
  return function(event) {
    readyHandlers[event.target.experience.id]();
  };
})();

var loadHandlers = {};
window.brightcove.__videoplayerLoad = (function() {
  return function(id) {
    loadHandlers[id]();
  };
})();

module.exports = brightcoveFactory;
