var assign = require('lodash-node/modern/objects/assign');
var videoService = require('./brightcove');

var videoPrototype = {
  init: function() {
    this.element = document.querySelector(this.element);
    this.element.innerHTML = '';
    this.element.appendChild(videoService.createHTML());
  }
};

function video(options) {
  if (!videoService.isLoading && !videoService.hasLoaded) videoService.load();
  var instance = assign(Object.create(videoPrototype), options);
  instance.init();
  return instance;
}

module.exports = video;
