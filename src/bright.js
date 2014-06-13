var bright = {

  init: function() {
    if (typeof window.brightcove !== 'undefined') return false;
    var script = document.createElement('script');
    script.src = 'http://admin.brightcove.com/js/BrightcoveExperiences.js';
    document.body.appendChild(script);
    return true;
  }

};

module.exports = bright;
