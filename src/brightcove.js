var assign = require('lodash-node/modern/objects/assign');

var brightcove = {

  defaults: {
    isVid: true,
    isUI: true,
    includeAPI: true,
    templateReadyHandler: 'brightcove.__bright__.templateReadyHandler',
  },

  init: function(instance) {
    brightcove.createHTML(instance);
    if (brightcove.isLoading || brightcove.hasLoaded) return;
    brightcove.isLoading = true;
    var script = document.createElement('script');
    script.src = 'http://admin.brightcove.com/js/BrightcoveExperiences.js';
    script.onload = function() {
      brightcove.load(instance);
    };
    document.body.appendChild(script);
  },

  load: function(instance) {
    window.brightcove.__bright__ = {
      templateReadyHandler: function() {
        brightcove.hasLoaded = true;
        brightcove.isLoading = false;
        instance.emit('init');
      }
    };
    window.brightcove.createExperiences();
  },

  createHTML: function(instance) {
    var object = document.createElement('object');
    object.className = "BrightcoveExperience";
    var options = assign(brightcove.defaults, instance.options);
    for (var param in options) {
      object.appendChild(createParam(param, options[param]));
    }
    instance.element.appendChild(object);

    function createParam(name, value) {
      var param = document.createElement('param');
      param.name = name;
      param.value = value;
      return param;
    }
  }
};

module.exports = brightcove;
