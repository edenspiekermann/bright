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
    options = assign(this.defaults, options);

    this.id = 'brightcove'+getUniqueId();
    var object = createObjectTag(element, options);
    object.id = this.id;
    element.appendChild(object);

    loadHandlers[this.id] = bind(function() {
      this.api = window.brightcove.api.getExperience(this.id);
      this.player = this.api.getModule(window.brightcove.api.modules.APIModules.VIDEO_PLAYER);
    }, this);
    readyHandlers[this.id] = bind(function() {
      this.player.addEventListener(window.brightcove.api.events.MediaEvent.PLAY, emit.play);
      this.player.addEventListener(window.brightcove.api.events.MediaEvent.STOP, emit.pause);
      this.player.addEventListener(window.brightcove.api.events.MediaEvent.COMPLETE, emit.ended);
      emit.init();
      this._isReady = true;
      if (this._loadedVideo) this.load(this._loadedVideo, emit.loadstart);
      if (this._shouldPlay) setTimeout(bind(this.play,this), 500);
    }, this);

    window.brightcove.createExperience(object, object);
  },

  load: function(videoId, emitLoadstart) {
    this._loadedVideo = videoId;
    if (!this._isReady) return;
    this.player.cueVideoByID(videoId);
    delete this._loadedVideo;
    emitLoadstart();
  },

  play: function() {
    if (!this._isReady) {
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

var readyHandlers = {};
var loadHandlers = {};

window.brightcove.__videoplayerReady = (function() {
  return function(event) {
    readyHandlers[event.target.experience.id]();
  };
})();
window.brightcove.__videoplayerLoad = (function() {
  return function(id) {
    loadHandlers[id]();
  };
})();

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

module.exports = brightcoveFactory;
