# Writable stream for DOM images

So you can just pipe to image. Mostly for `node-webkit`, but may work with `browserify`.

# Example

```javascript
var ImageStream = require('image-stream');
var fs = require('fs');
var window = getWindowSomehow();

var stream = new ImageStream(window.document.getElementById('image'));

fs.createReadStream(__dirname + '/octocat.png').pipe(stream);
```