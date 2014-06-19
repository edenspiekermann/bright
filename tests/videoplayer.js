/* global videoplayer, test, expect, ok, stop, start */

module('Initialization');

test('Brightcove (default video service)', function() {
  expect(2);
  stop(2);

  var element1 = document.getElementById('player1');
  var element2 = document.getElementById('player2');

  var player1 = videoplayer(element1, {
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });
  var player2 = videoplayer(element2, {
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });

  player1.once('init', function(player) {
    ok(player, 'init event for player1 has been fired');
    start();
  });
  player2.once('init', function(player) {
    ok(player, 'init event for player2 has been fired');
    start();
  });
});

module('API');

test('Player', function() {
  expect(6);
  stop(6);

  var testVideoId = 1926945850001;
  var element1 = document.getElementById('player1');
  var element2 = document.getElementById('player2');

  var player1 = videoplayer(element1, {
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });
  var player2 = videoplayer(element2, {
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });
  player1.load(testVideoId);
  player1.play();

  player1.once('loadstart', function() {
    ok(true, 'can load a video');
    start();
  });

  player1.once('play', function(player1) {
    ok(true, 'can play a video');
    start();
    setTimeout(function() {
      player1.pause();
    }, 3000);
  });

  player1.once('pause', function(player1) {
    ok(true, 'can pause a video');
    start();

    player1.once('pause', function() {
      ok(true, 'catch pause event on video end');
      start();
    });

    setTimeout(function() {
      player1.play();
    }, 1000);
  });

  player1.once('ended', function() {
    ok(true, 'emit ended event after video playback');
    start();

    player2.load(testVideoId);
  });

  player2.once('loadstart', function() {
    ok(true, 'player2 should start loading after player1');
    start();
  });
  player2.on('play', function() {
    ok(false, 'player2 should not play');
    start();
  });
  player2.on('pause', function() {
    ok(false, 'player2 should not play');
    start();
  });

  // -- Logging for debugging --
  // player1.on('init', log('init'));
  // player1.on('loadstart', log('loadstart'));
  // player1.on('play', log('play'));
  // player1.on('pause', log('pause'));
  // player1.on('ended', log('ended'));
  // player2.on('init', log('init'));
  // player2.on('loadstart', log('loadstart'));
  // player2.on('play', log('play'));
  // player2.on('pause', log('pause'));
  // player2.on('ended', log('ended'));
  // function log(event) { return function() { console.log(event); }; }
});
