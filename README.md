# Videoplayer

This abstraction wraps any video service with the official HTML5 Media and Media Events API. It does not always have a complete feature parity, due to the lack of some features the video services don’t provide. An example of the HTML5 Media API can be found at [http://www.w3.org/2010/05/video/mediaevents.html](here).


## Installation

Until the library is published on `npm` you can install it via the github url scheme.

```bash
npm install edenspiekermann/brightcove-wrapper --save
```


## Usage

The source files are built by webpack to the UMD format. This means you can require `dist/videoplayer.js` via webpack, browserify or require.js. Although it’s not recommended you can also include `dist/videoplayer.min.js` in your html. This creates a global variable called `videoplayer`.

_Common.js (webpack, browserify…)_
```js
var videoplayer = require('videoplayer'); // installed via npm
var videoplayer = require('./path_to/videoplayer.js'); // use the one in the dist folder

var player = videoplayer(domElement, options);
```

_Require.js_
```js
require(['videoplayer'], function(videoplayer) {
  var player = videoplayer(domElement, options);
});
```

_Global Variable_
```html
<script src="//admin.brightcove.com/js/BrightcoveExperiences.js"></script>
<script src="videoplayer.min.js"></script>
<script src="main.js">
```
```js
// main.js
var player = videoplayer(domElement, options);
```

___Note:___ If you want to use brightcove make sure to [add its script](#brightcove) first.


## API

```js
var player = videoplayer(domElement, options, videoService);

// omit video service if you use brightcove
var brightcovePlayer = videoplayer(domElement, options);

player.load(videoId);
player.play();
player.pause();

// you may chain methods
player.load(videoId).play();

// or use play directly
player.play(videoId);

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

Brightcove is the default video provider and currently built into the library itself, as it was built solely as an abstraction for Brightcove in the first place. During development it became clear that it could easily be extended, so it was rewritten in a more generic approach. Brightcove being included as the default video service may be removed in future versions.

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
