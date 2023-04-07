var ytdl = require('ytdl-core');

module.exports = Track = function(video) {
  this.video = video;
  this.url = video.url;
  this.title = video.title;
}

Track.prototype.stream = function() {
  return ytdl(this.url, {
    filter: format => {
      return format.container === 'mp4' && format.audioEncoding != null;
    },
    quality: 'lowest'
  });
}
