var assign = require('lodash-node/modern/objects/assign');
var emitter = require('component-emitter');
var videoService = require('./brightcove');

function video(options) {
  if (!videoService.isLoading && !videoService.hasLoaded) videoService.load();
  var instance = assign(Object.create(emitter(videoPrototype)), options);
  instance.init();
  return instance;
}

var videoPrototype = {
  init: function() {
    this.element = document.querySelector(this.element);
    this.element.innerHTML = '';
    this.element.appendChild(videoService.createHTML());
  },
  load: function() {
    this.emit('loadstart');
  },
  play: function() {
    this.emit('play');
  },
  pause: function() {
    this.emit('pause');
  }
};

module.exports = video;
