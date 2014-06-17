/* global video, test, expect, ok, stop, start */

module('Initialization');

test('VideoService', function() {
  expect(2);

  var player1 = video({
    element: '#player1',
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });
  var player2 = video({
    element: '#player2',
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });

  stop(2);
  player1.once('init', function() {
    console.log('init 1');
    ok(true, 'brightcove for player1 initialized');
    start();
  });
  player2.once('init', function() {
    console.log('init 2');
    ok(true, 'brighcove for player1 initialized');
    start();
  });
});

// test('Video', function() {
//   expect(1);

//   var player = video({
//     element: '#player1',
//     playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
//   });

//   player.on('loadstart', function() {
//     ok(true, 'can load a video');
//     start();
//   });

//   player.on('play', function() {
//     ok(true, 'can play a video');
//     start();
//   });

//   player.on('pause', function() {
//     ok(true, 'can pause a video');
//     start();
//   });

//   player.on('ended', function() {
//     ok(true, 'emit ended event after video playback');
//   });

  // stop();
  // player.load(1754276221001);

//   stop();
//   player.play();

//   stop();
//   player.pause();
// });

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
