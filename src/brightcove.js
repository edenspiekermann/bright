var brightcove = {

  defaults: {
    isVid: true,
    isUI: true,
    includeAPI: true,
    templateLoadHandler: 'brightcove.__bright__.templateLoadHandler',
    templateReadyHandler: 'brightcove.__bright__.templateReadyHandler'
  },

  load: function() {
    brightcove.isLoading = true;
    var script = document.createElement('script');
    script.src = 'http://admin.brightcove.com/js/BrightcoveExperiences.js';
    script.onload = brightcove.init;
    document.body.appendChild(script);
  },

  init: function() {
    brightcove.hasLoaded = true;
    brightcove.isLoading = false;
    window.brightcove.__bright__ = {
      templateReadyHandler: readyHandler,
      templateLoadHandler: loadHandler
    };
    window.brightcove.createExperiences();
  },

  createHTML: function() {
    var object = document.createElement('object');
    object.className = "BrightcoveExperience";
    for (var option in brightcove.defaults) {
      object.appendChild(createParam(option, brightcove.defaults[option]));
    }
    return object;

    function createParam(name, value) {
      var param = document.createElement('param');
      param.name = name;
      param.value = value;
      return param;
    }
  }
};

function readyHandler() {
  console.log('readyHandler');
}

function loadHandler() {
  console.log('loadHandler');
}

module.exports = brightcove;
