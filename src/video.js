var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');
var videoService = require('./brightcove');
var emitter = require('component-emitter');

function playerFactory(options) {
  var player = Object.create(playerPrototype);
  player = emitter(player);
  player.init(options);
  return player;
}

var playerPrototype = {
  init: function(options) {
    this.options = assign({}, options);
    this.element = document.querySelector(this.options.element);
    delete this.options.element;
    videoService.init(this);
    return this;
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

module.exports = playerFactory;
