/* global video, test, expect, ok, stop, start */

module('Initialization');

test('player', function() {
  expect(3);

  var player1 = video({
    element: '#player1',
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });
  var player2 = video({
    element: '#player2',
    playerKey: 'AQ~~,AAABmA9XpXk~,-Kp7jNgisreaNI4gqZCnoD2NqdsPzOGP'
  });

  ok(player1.element.innerHTML, 'appended html to player1');
  ok(player2.element.innerHTML, 'appended html to player2');
  stop();

  setTimeout(function() {
    ok(!!window.brightcove.__bright__, 'loaded brightcove');
    start();
  },2000);
});

// module('Methods');
// test('Player can load a video');
// test('Player can play a video');
// test('Player can pause a video');

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
