var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');
var emitter = require('component-emitter');

var brightcovePrototype = {

  defaults: {
    isVid: true,
    isUI: true,
    includeAPI: true,
    wmode: 'transparent',
    bgcolor: 'transparent',
    templateLoadHandler: 'brightcove.__bright__.templateLoadHandler',
    templateReadyHandler: 'brightcove.__bright__.templateReadyHandler'
  },

  init: function(element, options, emitter) {
    options = assign(this.defaults, options);
    createHTML(element, options);
    this.emitter = emitter;
    if (brightcovePrototype.isLoading || brightcovePrototype.hasLoaded) return;
    brightcovePrototype.isLoading = true;
    var script = document.createElement('script');
    script.src = 'http://admin.brightcove.com/js/BrightcoveExperiences.js';
    script.onload = bind(this._init, this);
    document.body.appendChild(script);
  },

  load: function(videoId) {
    this.player.cueVideoByID(videoId);
  },

  _init: function() {
    window.brightcove.__bright__ = {};
    window.brightcove.__bright__.templateLoadHandler = bind(function(experienceID) {
      this.api = window.brightcove.api.getExperience(experienceID);
      this.player = this.api.getModule(window.brightcove.api.modules.APIModules.VIDEO_PLAYER);
    }, this);
    window.brightcove.__bright__.templateReadyHandler = bind(function() {
      brightcovePrototype.hasLoaded = true;
      brightcovePrototype.isLoading = false;
      setTimeout(bind(function() {
        this.emitter('init');
      }, this));
    }, this);
    window.brightcove.createExperiences();
  }

};

function brightcoveFactory() {
  return Object.create(emitter(brightcovePrototype));
}

function createHTML(element, options) {
  var object = document.createElement('object');
  object.className = "BrightcoveExperience";
  for (var param in options) {
    object.appendChild(createParam(param, options[param]));
  }
  element.appendChild(object);

  function createParam(name, value) {
    var param = document.createElement('param');
    param.name = name;
    param.value = value;
    return param;
  }
}

module.exports = brightcoveFactory;
