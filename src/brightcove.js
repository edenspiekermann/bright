var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');

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

  init: function(options, templateReady, templateLoaded) {
    this._createHTML(options, templateReady);
    if (brightcovePrototype.isLoading || brightcovePrototype.hasLoaded) return;
    brightcovePrototype.isLoading = true;
    var script = document.createElement('script');
    script.src = 'http://admin.brightcove.com/js/BrightcoveExperiences.js';
    script.onload = bind(this._init, this, templateLoaded);
    document.body.appendChild(script);
  },

  load: function(videoId, callback) {
    brightcove.player.cueVideoByID(videoId);
    callback();
  },

  _createHTML: function(options, templateReady) {
    var object = document.createElement('object');
    object.className = "BrightcoveExperience";
    options = assign(this.defaults, options);
    for (var param in options) {
      object.appendChild(createParam(param, options[param]));
    }
    setTimeout(function() {
      templateReady(object);
    });

    function createParam(name, value) {
      var param = document.createElement('param');
      param.name = name;
      param.value = value;
      return param;
    }
  },

  _init: function(templateLoaded) {
    window.brightcove.__bright__ = {};
    window.brightcove.__bright__.templateLoadHandler = bind(function(experienceID) {
      this.api = window.brightcove.api.getExperience(experienceID);
      this.player = this.api.getModule(window.brightcove.api.modules.APIModules.VIDEO_PLAYER);
    }, this);
    window.brightcove.__bright__.templateReadyHandler = function() {
      brightcovePrototype.hasLoaded = true;
      brightcovePrototype.isLoading = false;
      templateLoaded();
    };
    window.brightcove.createExperiences();
  }

};

function brightcoveFactory() {
  return Object.create(brightcovePrototype);
}

module.exports = brightcoveFactory;
