var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');

var brightcove = {

  defaults: {
    isVid: true,
    isUI: true,
    includeAPI: true,
    wmode: 'transparent',
    bgcolor: 'transparent'
  },

  init: function(element, options, emitter) {
    if (!brightcove.isLoading && !brightcove.hasLoaded) insertBrightcoveScript();
    options = assign(brightcove.defaults, options);
    createHTML(element, options);
    loadHandler[options.element] = bind(function(experienceID) {
      console.log(experienceID, this);
      this.api = window.brightcove.api.getExperience(experienceID);
      this.player = this.api.getModule(window.brightcove.api.modules.APIModules.VIDEO_PLAYER);
    }, this);
    readyHandler[options.element] = function() {
      console.log('ready');
      emitter('init');
    };
  },

  load: function(videoId) {
    this.player.cueVideoByID(videoId);
  }

};

function brightcoveFactory() {
  return Object.create(brightcove);
}

function insertBrightcoveScript() {
  brightcove.isLoading = true;
  var script = document.createElement('script');
  script.src = 'http://admin.brightcove.com/js/BrightcoveExperiences.js';
  script.onload = function() {
    brightcove.isLoading = false;
    brightcove.hasLoaded = true;
    window.brightcove.__load__ = {};
    window.brightcove.__ready__ = {};
    addHandlers();
  };
  document.body.appendChild(script);
}

var loadHandler = {};
var readyHandler = {};

function addHandlers() {
  var handler;
  for (handler in loadHandler) {
    window.brightcove.__load__[handler] = loadHandler[handler];
  }
  for (handler in readyHandler) {
    window.brightcove.__ready__[handler] = readyHandler[handler];
  }
  window.brightcove.createExperiences();
}

function createHTML(element, options) {
  var object = document.createElement('object');
  object.className = "BrightcoveExperience";
  for (var param in options) {
    if (param === 'element') {
      object.appendChild(createParam('templateLoadHandler', "brightcove.__load__['"+options[param]+"']"));
      object.appendChild(createParam('templateReadyHandler', "brightcove.__ready__['"+options[param]+"']"));
      continue;
    }
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
