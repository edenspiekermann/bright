var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');
var emitter = require('component-emitter');

var defaultVideoService = require('./brightcove');

var playerPrototype = {

  init: function(element, options, videoService) {
    this.element = element;
    this.options = assign({}, options);
    this._service = (videoService) ? videoService() : defaultVideoService();

    var events = {
      init: bind(this.emit, this, 'init', this),
      play: bind(this.emit, this, 'play', this),
      pause: bind(this.emit, this, 'pause', this),
      loadstart: bind(this.emit, this, 'loadstart', this),
      ended: bind(this.emit, this, 'ended', this)
    };

    this._service.init(this.element, this.options, events);
    return this;
  },

  load: function(videoId) {
    if (typeof videoId === 'undefined') throw new Error('missing video id');
    this._service.load(videoId, bind(this.emit, this, 'loadstart', this));
    return this;
  },

  play: function(videoId) {
    this._service.play(videoId, bind(this.emit, this, 'play', this));
    return this;
  },

  pause: function() {
    this._service.pause(bind(this.emit, this, 'pause', this));
    return this;
  }

};

function playerFactory() {
  var player = Object.create(playerPrototype);
  player = emitter(player);
  return player.init.apply(player, arguments);
}

module.exports = playerFactory;
