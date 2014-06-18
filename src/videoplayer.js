var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');
var emitter = require('component-emitter');

var defaultVideoService = require('./brightcove');

var playerPrototype = {

  init: function(element, options, videoService) {
    this.element = element;
    this.options = assign({}, options);
    this._service = (videoService) ? videoService() : defaultVideoService();

    this._service.init(this.element, this.options, bind(this.emit, this, 'init', this));
    return this;
  },

  load: function(videoId) {
    this._service.load(videoId);
  },

  play: function() {
    this._service.play();
  },

  pause: function() {
    this._service.pause();
  }

};

function playerFactory() {
  var player = Object.create(playerPrototype);
  player = emitter(player);
  return player.init.apply(player, arguments);
}

module.exports = playerFactory;
