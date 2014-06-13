var isInitialized = false;

var bright = {

  init: function() {
    if (this.isInit()) return false;
    var script = document.createElement('script');
    script.src = 'http://admin.brightcove.com/js/BrightcoveExperiences.js';
    script.onload = function() {
      isInitialized = true;
    };
    document.body.appendChild(script);
    return true;
  },

  isInit: function() {
    return isInitialized;
  }

};

module.exports = bright;
