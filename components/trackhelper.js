var YouTube = require('youtube-node');
var youTube = new YouTube();
var ytdl = require('ytdl-core');
var Track = require('./track.js');
var Helper = require('./helper.js');

var exports = {};

module.exports = TrackHelper = function() {
  Helper.key('apikeys', 'youtube').then(function(val) {
    if (val == Helper.standardValues().youtube) {
      throw 'Youtube api key not set, music service cannot load.';
    }
    
    youTube.setKey(val);
  }).catch(console.error);
}

TrackHelper.prototype.getVideoFromUrl = function(url) {
  return new Promise(function(resolve, reject) {
    ytdl.getInfo(url, (err, info) => {
      if (err) reject(err);
      resolve(new Track(buildTrack(info, url)));
    });
  });
}

TrackHelper.prototype.getRandomVideo = function(searchWord, amount) {
  var videoList = [];
  var baseUrl = 'https://www.youtube.com/watch?v=';

  return new Promise(function(resolve, reject) {
    youTube.search(searchWord, amount, function(error, result) {
      if (error) reject('No videos found.');

      result.items.forEach(function(item) {
        if (item.id.videoId) {
          var url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
          videoList.push(new Track(buildTrack(item, url)));
        }
      });

      videoList = Helper.shuffle(videoList);
      videoList.forEach(function(video) {
        if (video && video.url && video.title) {
          return resolve(video);
        }
      })
    });
  });
}

function buildTrack(video, url) {
  return {
    video: video,
    url: url.replace(" ", ""),
    title: video.title || video.snippet.title
  }
}
