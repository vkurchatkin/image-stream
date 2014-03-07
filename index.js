var WritableStream = require('stream').Writable;
var inherits = require('util').inherits;

function concat (list, window) {
  var length = 0;
  var i, j;

  for (i = 0; i < list.length; i++) {
    length += list[i].length;
  }

  //using window is super important
  //otherwise resulting blob will be broken
  //some cross context security stuff probably
  var buffer = new window.Uint8Array(length);
  var pos = 0;

  for (i = 0; i < list.length; i++) {
    var buf = list[i];
    for (j = 0; j < buf.length; j++, pos++) {
      buffer[pos] = buf[j];
    }
  }

  return buffer;
}

function ImageStream (el) {
  if (!(this instanceof ImageStream)) return new ImageStream(el);
  WritableStream.call(this);
  this.el = el;
  this.window = this.el.ownerDocument.defaultView;
  this._chunks = [];
}

inherits(ImageStream, WritableStream);

ImageStream.prototype._write = write;
ImageStream.prototype.end = end;

function write (chunk, encoding, callback) {
  this._chunks.push(chunk);
  process.nextTick(callback);
}

function end (chunk, encoding, callback) {
  var stream = this;

  if (chunk) {
    this.write(chunk, encoding, _callback);
  } else {
    process.nextTick(_callback);
  }

  function _callback () {
    var buffer = concat(stream._chunks, stream.window);
    var blob = new stream.window.Blob([buffer]);
    var src = stream.window.URL.createObjectURL(blob);

    stream.el.src = src;
    stream.window.URL.revokeObjectURL(src); // maybe what for `load`
    stream._chunks = [];
  }
}

module.exports = ImageStream;
