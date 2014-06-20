var assign = require('lodash-node/modern/objects/assign');
var bind = require('lodash-node/modern/functions/bind');
var emitter = require('component-emitter');

var getUniqueId = require('./helpers/getUniqueId');
var createObjectTag = require('./helpers/createObjectTag');
var handlers = require('./helpers/brightcoveHandlers');

var bright = {

  defaults: {
    isVid: true,
    isUI: true,
    includeAPI: true,
    wmode: 'transparent',
    bgcolor: '#ffffff',
    templateLoadHandler: 'brightcove.__videoplayerLoad',
    templateReadyHandler: 'brightcove.__videoplayerReady'
  },

  init: function(element, options) {
    this._element = element || this._element;
    this._options = assign({}, this.defaults, options || this._options);
    this._id = this._id || 'brightcove'+getUniqueId();

    var object = createObjectTag(this._options);
    object.id = this._id;
    this._element.innerHTML = '';
    this._element.appendChild(object);

    handlers.loadHandlers[this._id] = bind(handlers.load, this);
    handlers.readyHandlers[this._id] = bind(handlers.ready, this, bind(onReady,this));

    function onReady() {
      this._isReady = true;
      if (this._videoId) this.load(this._videoId, bind(this.emit, this, 'loadstart', this));
      if (this._shouldPlay) setTimeout(bind(this.play,this), 500);
    }

    window.brightcove.createExperience(object, object);

    return this;
  },

  load: function(videoId) {
    if (!videoId) throw new Error('missing video id');

    this._videoId = videoId;
    if (!this._isReady) return;
    this._brightcove.player.cueVideoByID(videoId);
    this.emit('loadstart', this);

    return this;
  },

  play: function(videoId) {
    if (!this._isReady) {
      if (videoId) this._videoId = videoId;
      this._shouldPlay = true;
      return;
    }
    this._brightcove.player.loadVideoById(this._videoId);
    delete this._shouldPlay;

    return this;
  },

  pause: function() {
    this._brightcove.player.pause();
    return this;
  }

};

var brightWithEvents = emitter(bright);

function playerFactory() {
  var player = Object.create(brightWithEvents);
  return player.init.apply(player, arguments);
}

module.exports = playerFactory;
