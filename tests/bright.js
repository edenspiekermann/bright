module('Initialization');
test('brightcove', function() {
  expect(2);

  var initializing = bright.init();

  ok(initializing, 'starts loading');

  stop();
  setTimeout(function() {
    ok(typeof window.brightcove !== 'undefined', 'has been loaded');
    start();
  }, 1000);
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
