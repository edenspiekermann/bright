# bright

This facade wraps the [brightcove smart player api](http://docs.brightcove.com/en/video-cloud/smart-player-api/references/) with an easy to use interface.


## Installation

Until the library is published on `npm` you can install it via the github url scheme.

```bash
npm install edenspiekermann/brightcove-wrapper --save
```


## Usage

The source files are built by webpack to the UMD format. This means you can require `dist/bright.js` via webpack, browserify or require.js. Although it’s not recommended you can also include `dist/bright.min.js` in your html. This creates a global variable called `Bright`.

_Common.js (webpack, browserify…)_
```js
var Bright = require('bright'); // installed via npm
var Bright = require('./path_to/bright.js'); // use the one in the dist folder

var player = Bright(options);
```

_Require.js_
```js
require(['Bright'], function(Bright) {
  var player = Bright(options);
});
```

_Global Variable_
```html
<script src="//admin.brightcove.com/js/BrightcoveExperiences.js"></script>
<script src="bright.min.js"></script>
<script src="your_scripts.js">
```
```js
// main.js
var player = Bright(options);
```

___Note:___ `//admin.brightcove.com/js/BrightcoveExperiences.js` has to be loaded __before__ `bright.js`. Use your favorite script loader or simply add a `script` tag before your main js file.


## API

Example HTML:
```html
<div id="player"></div>
```
The brightcove player will be appended as a child to this element.

```js
var player = Bright({
  element: domElement,
  video: videoId, // reference id ('ref:XXXXX') or video id (number)
  player: playerKey // playerKey of the brightcove player
});

player.on('ended', function(player) { // wait for end of video
  player.load(videoId);
});

player.init(); // init player
```

Possible __options__ for brightcove can be found at [this page](http://support.brightcove.com/de/video-cloud/dokumente/player-konfigurationsparameter#supported) from the official documentation.

Currently supported __events__:
- load
- play
- pause
- ended

These __event methods__ are copied from [maxhoffmann/emitter](https://github.com/maxhoffmann/emitter):
- on(event, fn)
- once(event, fn)
- off(event, fn)


## Testing

Video and player id for testing are taken from [brightcove’s example page](http://files.brightcove.com/content.html). You may have to update them if they change.


## Development

1. Clone the repository
2. `npm install`
3. `npm start` to watch for file changes in `src/bright.js`
4. make changes
5. `npm test` starts a local server & opens your default browser with `http://localhost:8000/tests`
6. `npm run build` if all tests pass
7. push to `develop`, merge into `master`
