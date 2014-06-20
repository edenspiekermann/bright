var bind = require('lodash-node/modern/functions/bind');

var handlers = {

  readyHandlers: {},
  loadHandlers: {},

  load: function() {
    var brightcoveAPI = window.brightcove.api;
    this._brightcove = {};
    this._brightcove.experience = brightcoveAPI.getExperience(this._id);
    this._brightcove.player = this._brightcove.experience.getModule(brightcoveAPI.modules.APIModules.VIDEO_PLAYER);
  },

  ready: function(onReady) {
    this._brightcove.player.addEventListener(window.brightcove.api.events.MediaEvent.PLAY, bind(this.emit, this, 'play', this));
    this._brightcove.player.addEventListener(window.brightcove.api.events.MediaEvent.STOP, bind(this.emit, this, 'pause', this));
    this._brightcove.player.addEventListener(window.brightcove.api.events.MediaEvent.COMPLETE, bind(this.emit, this, 'ended', this));
    this.emit('init', this);
    onReady();
  }

};

window.brightcove.__videoplayerReady = function(event) {
  handlers.readyHandlers[event.target.experience.id]();
};

window.brightcove.__videoplayerLoad = function(id) {
  handlers.loadHandlers[id]();
};

module.exports = handlers;
