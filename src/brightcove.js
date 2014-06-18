var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');

var brightcove = {

  uniqueId: 0,

  defaults: {
    isVid: true,
    isUI: true,
    includeAPI: true,
    wmode: 'transparent',
    bgcolor: 'transparent'
  },

  init: function(element, options, emitter) {
    if (!this.isLoading && !this.hasLoaded) insertScript();
    options = assign(this.defaults, options);
    createHTML(element, this.uniqueId, options);
    loadHandler[this.uniqueId] = bind(function(experienceID) {
      this.api = window.brightcove.api.getExperience(experienceID);
      this.player = this.api.getModule(window.brightcove.api.modules.APIModules.VIDEO_PLAYER);
      window.brightcove.__readyHandlers__[experienceID] = function() {
        emitter('init');
      };
    }, this);
    this.uniqueId++;
  },

  load: function(videoId) {
    this.player.cueVideoByID(videoId);
  }

};

function insertScript() {
  brightcove.isLoading = true;
  var script = document.createElement('script');
  script.src = 'http://admin.brightcove.com/js/BrightcoveExperiences.js';
  script.onload = function() {
    brightcove.isLoading = false;
    brightcove.hasLoaded = true;
    window.brightcove.__loadHandlers__ = {};
    window.brightcove.__readyHandlers__ = {};
    window.brightcove.__ready__ = function(event) {
      window.brightcove.__readyHandlers__[event.target.experience.id]();
    };
    addHandlers();
  };
  document.body.appendChild(script);
}

var loadHandler = {};
function addHandlers() {
  for (var handler in loadHandler) {
    window.brightcove.__loadHandlers__[handler] = loadHandler[handler];
  }
  window.brightcove.createExperiences();
}

function createHTML(element, id, options) {
  var object = document.createElement('object');
  object.className = "BrightcoveExperience";
  for (var param in options) {
    object.appendChild(createParam(param, options[param]));
  }
  object.appendChild(createParam('templateLoadHandler', "brightcove.__loadHandlers__['"+id+"']"));
  object.appendChild(createParam('templateReadyHandler', "brightcove.__ready__"));
  element.appendChild(object);

  function createParam(name, value) {
    var param = document.createElement('param');
    param.name = name;
    param.value = value;
    return param;
  }
}

module.exports = brightcove;
