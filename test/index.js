var fs = require('fs');
var ImageStream = require('./..');

module.exports = function (window) {
  var image = window.document.getElementById('image');
  var stream = new ImageStream(image);

  fs.createReadStream(__dirname + '/octocat.png').pipe(stream);

  setTimeout(function () {
    fs.createReadStream(__dirname + '/octocat1.png').pipe(stream);
  }, 5000);

};