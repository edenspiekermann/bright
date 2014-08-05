/* global Bright, test, expect, ok, stop, start, throws */

var testData = {
	brightcoveVideoId: 1926945850001,
	brightcovePlayerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
};
function log(event) {
	return function() {
		if (typeof console !== 'undefined') console.log(event);
	};
}

module('API');

test('init', function() {
	expect(2);
	stop(2);

	var element1 = document.getElementById('player1');
	var element2 = document.getElementById('player2');

	var player1 = Bright(element1, {
		playerKey: testData.brightcovePlayerKey
	});
	var player2 = Bright(element2, {
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

	player1.init();
	player2.init();
});

test('methods', function() {
	expect(11);
	stop(6);

	var element1 = document.getElementById('player1');
	var element2 = document.getElementById('player2');

	var player1 = Bright(element1, {
		playerKey: testData.brightcovePlayerKey
	});
	var player2 = Bright(element2, {
		playerKey: testData.brightcovePlayerKey
	});
	player1.init();
	player2.init();

	player1.once('init', function(player1) {
		player1.load(testData.brightcoveVideoId);
	});

	player1.once('load', function(player1) {
		ok(true, 'can load a video');
		ok(player1, 'instance is passed to the listener');
		start();
		player1.play();
	});

	player1.once('play', function(player1) {
		ok(true, 'can play a video');
		ok(player1, 'instance is passed to the listener');
		start();
		setTimeout(function() {
			player1.pause();
		}, 2000);
	});

	player1.once('pause', function(player1) {
		ok(true, 'can pause a video');
		ok(player1, 'instance is passed to the listener');
		start();

		player1.once('pause', function() {
			ok(true, 'catch pause event on video end');
			start();
		});

		setTimeout(function() {
			player1.play();
		}, 1000);
	});

	player1.once('ended', function(player1) {
		ok(true, 'emit ended event after video playback');
		ok(player1, 'instance is passed to the listener');
		start();

		player2.load(testData.brightcoveVideoId);
	});

	player2.once('load', function(player2) {
		ok(true, 'player2 should load');
		ok(player2, 'instance is passed to the listener');
		start();
		player2.play();
	});
	player2.on('play', function(player2) {
		ok(false, 'player2 should not play');
		ok(player2, 'instance is passed to the listener');
		start();
	});
	player2.on('pause', function(player2) {
		ok(false, 'player2 should not play');
		ok(player2, 'instance is passed to the listener');
		start();
	});

	player1.on('init', log('init'));
	player1.on('load', log('load'));
	player1.on('play', log('play'));
	player1.on('pause', log('pause'));
	player1.on('ended', log('ended'));
	player2.on('init', log('init'));
	player2.on('load', log('load'));
	player2.on('play', log('play'));
	player2.on('pause', log('pause'));
	player2.on('ended', log('ended'));
});

test('play', function() {
	expect(1);
	stop();

	var element = document.getElementById('player1');

	var player = Bright(element, {
		playerKey: testData.brightcovePlayerKey
	});
	player.once('init', function(player) {
		player.play(testData.brightcoveVideoId);
	});
	player.init();

	player.once('play', function() {
		ok(true, 'can directly play a video via its ID');
		start();
	});
});

test('load', function() {
	expect(1);
	stop();

	var element = document.getElementById('player1');

	var player = Bright(element, {
		playerKey: testData.brightcovePlayerKey
	});

	player.once('init', function(player) {
		throws(function() {
			player.load();
		}, 'you have to pass a videoId to load');
		start();
	});

	player.init();
});

test('display: none', function() {
  expect(1);
  stop();

  var element = document.getElementById('player1');
  var wrapper = document.getElementById('qunit-fixture');

  var player = Bright(element, {
    playerKey: testData.brightcovePlayerKey
  });

  player.once('init', function(player) {
     player.load(testData.brightcoveVideoId);
  });

  player.once('load', function(player) {
  	wrapper.style.display = 'none';

  	setTimeout(function() {
  	  wrapper.style.display = '';

  	  player.reinit();

  	  player.once('load', function() {
  	    ok(true, 'player can be reinitialized after it was hidden via CSS');
  	    start();
  	  });
  	});
  });

  player.init();

  player.on('init', log('init'));
  player.on('load', log('load'));
});

test('visibility: hidden', function() {
  expect(1);
  stop();

  var element = document.getElementById('player1');
  var wrapper = document.getElementById('qunit-fixture');

  var player = Bright(element, {
    playerKey: testData.brightcovePlayerKey
  });

  player.load(testData.brightcoveVideoId);

  setTimeout(function() {
    wrapper.style.visibility = 'hidden';

    setTimeout(function() {
      wrapper.style.visibility = '';

      player.init();

      player.once('load', function() {
        ok(true, 'player can be reinitialized after it was hidden via CSS');
        start();
      });
    }, 2000);
  }, 2000);

  player.on('init', log('init'));
  player.on('load', log('load'));
});
