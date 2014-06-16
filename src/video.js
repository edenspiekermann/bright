var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');
var emitter = require('component-emitter');

var videoService = require('./brightcove');

var playerPrototype = {

  init: function(options) {
    this.element = document.querySelector(options.element);
    delete options.element;
    this.options = assign({}, options);

    this._service = videoService();
    this._service.init(options, bind(this.emit, this, 'templateReady'), bind(this.emit, this, 'templateLoaded'));
  },

  load: function(videoId) {
    if (this._service.player) {
      this._service.player.load(videoId, bind(this.emit, this, 'loadstart'));
      this.emit('loadstart');
      return;
    }
    this.once('templateLoaded', function() {
      this.load(videoId);
    }, this);
  },

  play: function() {
    this._service.player.play(bind(this.emit, this, 'play'));
  },

  pause: function() {
    this._service.player.pause(bind(this.emit, this, 'pause'));
  }

};

function playerFactory(options) {
  var player = Object.create(playerPrototype);
  player = emitter(player);
  player.on('templateReady', function(html) {
    this.element.appendChild(html);
  });
  player.init(options);
  return player;
}

module.exports = playerFactory;
