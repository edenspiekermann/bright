/* global Bright */
/* jshint qunit:true */

var testData = {
  videoId: 2470339735001,
  playerKey: 'AQ~~,AAAB051hMkE~,GF6aXC8LXBNMR9-3c7Rsg36sl9a6CIqi'
};

test('init', function() {
  expect(2);
  stop(2);

  var element1 = document.getElementById('player1');
  var element2 = document.getElementById('player2');

  var player1 = Bright({
    element: element1,
    video: testData.videoId,
    player: testData.playerKey
  });
  var player2 = Bright({
    element: element2,
    video: testData.videoId,
    player: testData.playerKey
  });

  player1.once('load', function() {
    ok(true, 'load event for player1 has been fired');
    start();
  });
  player2.once('load', function() {
    ok(true, 'load event for player2 has been fired');
    start();
  });
});

test('events', function() {
  expect(4);
  stop(4);

  var element = document.getElementById('player1');

  var player = Bright({
    element: element,
    video: testData.videoId,
    player: testData.playerKey
  });

  player.once('load', function() {
    ok(true, 'player1 triggered load event');
    start();
  });
  player.once('play', function() {
    ok(true, 'player1 triggered play event');
    start();
  });
  player.once('pause', function() {
    ok(true, 'player1 triggered pause event');
    start();
  });
  player.once('end', function() {
    ok(true, 'player1 triggered end event');
    start();
  });
});

test('chaining', function() {
  expect(2);
  stop(2);

  var element = document.getElementById('player1');

  var player = Bright({
    element: element,
    video: testData.videoId,
    player: testData.playerKey
  });

  player.once('end', function(player) {
    ok(player, 'player1 triggered end event');
    start();

    player.once('load', function() {
      ok(true, 'loaded next video');
      start();
    });
    player.load(testData.videoId);
  });
});

test('hiding', function() {
  expect(2);
  stop(2);

  var element = document.getElementById('player1');
  var wrapper = document.getElementById('qunit-fixture');

  var player = Bright({
    element: element,
    video: testData.videoId,
    player: testData.playerKey
  });

  player.once('load', function() {
    ok(true, 'player inits');
    start();

    setTimeout(function() {
      wrapper.style.display = 'none';

      setTimeout(function() {
        player.once('play', function() {
          ok(true, 'player can player after being hidden');
          start();
        });
        wrapper.style.display = '';
      });
    });
  });
});
