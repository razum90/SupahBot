var YouTube = require('youtube-node');
var youTube = new YouTube();
var ytdl = require('ytdl-core');

var exports = {};

module.exports = Track = function(video) {
  this.video = video;
  this.url = video.url;
  this.title = video.title;
}

Track.prototype.getStream = function() {
  return ytdl(this.url, {
    filter: function(format) {
      return format.container === 'mp4';
    },
    quality: 'lowest'
  });
}
