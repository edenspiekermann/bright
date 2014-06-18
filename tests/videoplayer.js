/* global videoplayer, test, expect, ok, stop, start */

module('Initialization');

test('VideoService', function() {
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

test('Player', function() {
  expect(4);
  stop(4);

  var element = document.getElementById('player1');

  var player = videoplayer(element, {
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });

  player.once('init', function(player) {
    console.log('init');
    player.load(1926945850001);
  });

  player.once('loadstart', function(player) {
    console.log('loadstart');
    ok(true, 'can load a video');
    start();

    player.play();
  });

  player.once('play', function(player) {
    console.log('play');
    ok(true, 'can play a video');
    start();
    setTimeout(function() {
      player.pause();
    }, 3000);
  });

  player.once('pause', function(player) {
    console.log('pause');
    ok(true, 'can pause a video');
    start();
    setTimeout(function() {
      player.play();
    }, 1000);
  });

  player.once('ended', function() {
    console.log('ended');
    ok(true, 'emit ended event after video playback');
    start();
  });
});

// module('Readable Player Properties');
// test('Player has a readable volume attribute');
// test('Player has a readable muted attribute');
// test('Player has a readable controls attribute');
// test('Player has a readable loop attribute');
// test('Player has a readable autoplay attribute');

// module('Writable Player Properties');
// test('Player has a writable volume attribute');
// test('Player has a writable muted attribute');

// module('Readable Video Properties');
// test('Player has a readable currentTime attribute');
// test('Player has a readable duration attribute');
// test('Player has a readable paused attribute');

// module('Writeable Video Properties');
// test('Player has a writable currentTime attribute');

// module('Player Events');
// test('Player emits a loadStart event');
// test('Player emits a progress event');
// test('Player emits a error event');
// test('Player emits a playing event');
// test('Player emits a ended event');
// test('Player emits a play event');
// test('Player emits a pause event');
