var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');
var emitter = require('component-emitter');

var defaultVideoService = require('./brightcove');

var playerPrototype = {

  init: function(element, options, videoService) {
    this.element = element;
    this.options = assign({}, options);
    this._service = (videoService) ? videoService() : defaultVideoService();

    var callbacks = {
      init: bind(this.emit, this, 'init', this),
      play: bind(this.emit, this, 'play', this),
      pause: bind(this.emit, this, 'pause', this),
      ended: bind(this.emit, this, 'ended', this)
    };

    this._service.init(this.element, this.options, callbacks);
    return this;
  },

  load: function(videoId) {
    this._service.load(videoId, bind(this.emit, this, 'loadstart', this));
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
