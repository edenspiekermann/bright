/* global videoplayer, test, expect, ok, stop, start, throws */

var testData = {
  brightcoveVideoId: 1926945850001,
  brightcovePlayerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
};
function log(event) {
  return function() {
    if (console) console.log(event);
  };
}

module('Initialization');

test('Brightcove (default video service)', function() {
  expect(2);
  stop(2);

  var element1 = document.getElementById('player1');
  var element2 = document.getElementById('player2');

  var player1 = videoplayer(element1, {
    playerKey: testData.brightcovePlayerKey
  });
  var player2 = videoplayer(element2, {
    playerKey: testData.brightcovePlayerKey
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

  var element1 = document.getElementById('player1');
  var element2 = document.getElementById('player2');

  var player1 = videoplayer(element1, {
    playerKey: testData.brightcovePlayerKey
  });
  var player2 = videoplayer(element2, {
    playerKey: testData.brightcovePlayerKey
  });
  player1.load(testData.brightcoveVideoId);
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

    player2.load(testData.brightcoveVideoId);
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

  player1.on('init', log('init'));
  player1.on('loadstart', log('loadstart'));
  player1.on('play', log('play'));
  player1.on('pause', log('pause'));
  player1.on('ended', log('ended'));
  player2.on('init', log('init'));
  player2.on('loadstart', log('loadstart'));
  player2.on('play', log('play'));
  player2.on('pause', log('pause'));
  player2.on('ended', log('ended'));
});

test('Player', function() {
  expect(1);
  stop();

  var element = document.getElementById('player1');

  var player = videoplayer(element, {
    playerKey: testData.brightcovePlayerKey
  });

  player.play(testData.brightcoveVideoId);

  player.once('play', function() {
    ok(true, 'can directly play a video via its ID');
    start();
  });
});

module('Error Handling');

test('Wrong Usage', function() {
  expect(1);

  var element = document.getElementById('player1');

  var player = videoplayer(element, {
    playerKey: testData.brightcovePlayerKey
  });

  throws(function() {
    player.load();
  }, 'you have to pass a videoId to load');
});

test('CSS', function() {
  expect(1);
  stop();

  var element = document.getElementById('player1');
  var wrapper = document.getElementById('qunit-fixture');

  var player = videoplayer(element, {
    playerKey: testData.brightcovePlayerKey
  });

  player.load(testData.brightcoveVideoId);

  setTimeout(function() {
    wrapper.style.cssText = "display:none";

    setTimeout(function() {
      wrapper.style.cssText = "";

      player.init();

      player.once('loadstart', function() {
        ok(true, 'player can be reinitialized after it was hidden via CSS');
        start();
      });
    }, 2000);
  }, 2000);

  player.on('init', log('init'));
  player.on('loadstart', log('loadstart'));
  player.on('play', log('play'));
  player.on('pause', log('pause'));
  player.on('ended', log('ended'));
});
