# bright

This abstraction wraps the brightcove smart player api with an easy to use interface. bright’s API follows the naming conventions of the official HTML5 Media and Media Events API. An example of the full standard can be found at http://www.w3.org/2010/05/video/mediaevents.html.


## Installation

Until the library is published on `npm` you can install it via the github url scheme.

```bash
npm install edenspiekermann/brightcove-wrapper --save
```


## Usage

The source files are built by webpack to the UMD format. This means you can require `dist/bright.js` via webpack, browserify or require.js. Although it’s not recommended you can also include `dist/bright.min.js` in your html. This creates a global variable called `bright`.

_Common.js (webpack, browserify…)_
```js
var bright = require('bright'); // installed via npm
var bright = require('./path_to/bright.js'); // use the one in the dist folder

var player = bright(domElement, options);
```

_Require.js_
```js
require(['bright'], function(bright) {
  var player = bright(domElement, options);
});
```

_Global Variable_
```html
<script src="//admin.brightcove.com/js/BrightcoveExperiences.js"></script>
<script src="bright.min.js"></script>
<script src="main.js">
```
```js
// main.js
var player = bright(domElement, options);
```

___Note:___ Make sure to [add brightcove’s script](#brightcove) first.


## API

```js
var player = bright(domElement, options);

player.load(videoId);
player.play();
player.play(videoId); // loads and plays video
player.pause();

// chaining
player.load(videoId).play();

// reinitialize player after it was hidden via CSS
player.init();

// events
player.on('ended', function(player) {
  player.load(nextVideoID);
});
```

Event methods are copied from [component/emitter](https://github.com/component/emitter):
- on(event, fn)
- once(event, fn)
- off(event, fn)
- emit(event, …)
- listeners(event)
- hasListeners(event)

Currently supported events:
- init
- loadstart
- play
- pause
- ended


## Brightcove

__Required:__ `//admin.brightcove.com/js/BrightcoveExperiences.js` has to be loaded before the first usage of videoplayer.js. Use your favorite script loader or simply add a `script` tag before your main js file:
```html
<script src="//admin.brightcove.com/js/BrightcoveExperiences.js"></script>
<script src="main.js"></script>
```

Video and player id for testing are taken from [brightcoves example page](http://files.brightcove.com/content.html). You may have to update them if they change.


## Development

1. Clone the repository
2. `npm install`
3. `npm start` to watch for file changes in `src/videoplayer.js`
4. make changes
5. `npm test` starts a local server & opens your default browser with `http://localhost:8000/tests`
6. `npm run build` if all tests pass
7. push to `develop`, merge into `master`
