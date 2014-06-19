# Videoplayer

This abstraction wraps any video service with the official HTML5 Media and Media Events API. It does not always have a complete feature parity, due to the lack of some features the video servies don’t provide. An example of the HTML5 Media API can be found [http://www.w3.org/2010/05/video/mediaevents.html](here).

## Brightcove

Brightcove is the default video provider and currently built into the library itself, as it was built solely as an abstraction for Brightcove in the first place. During development it became clear that it could easily be extended, so it was rewritten in a more generic approach. The tight coupling with brightcove may be removed in future versions.

## API

initialization
```js
var player = videoplayer(domElement, options, videoService);

// omit video service if you use brightcove
var brightcovePlayer = videoplayer(domElement, options);
```

loading a video via its ID
```js
player.load(videoId);
```

play the loaded video
```js
player.play();
```

pause the video
```js
player.pause();
```

chaining
```js
var player = videoplayer(domElement, options).load(videoId).play();
```

## Development

1. Clone the repository
2. `npm install`
3. `npm start` to watch for file changes in `src/videoplayer.js`
4. make changes
5. `npm test` starts a local server & opens your default browser with `http://localhost:8000/tests`
6. `npm run build` if all tests pass
7. push to `develop`, merge into `master`
