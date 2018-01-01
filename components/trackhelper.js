/*
MIT License

Copyright (c) 2017 razum90

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var YouTube = require('youtube-node');
var youTube = new YouTube();
var ytdl = require('ytdl-core');
var Track = require('./track.js');
var Helper = require('./helper.js');

var exports = {};

module.exports = TrackHelper = function() {
  var vm = this;
  Helper.keys('apikeys', ['youtube']).then(function(keys) {
    youTube.setKey(keys.youtube);
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}

TrackHelper.prototype.getVideoFromUrl = function(url) {
  return new Promise(function(resolve, reject) {
    ytdl.getInfo(url, (err, info) => {
      if (err || !info) reject(err);
      resolve(new Track(buildTrack(info, url)));
    });
  });
}

TrackHelper.prototype.getRandomTrack = function(searchWord, amount) {
  var trackList = [];
  var baseUrl = 'https://www.youtube.com/watch?v=';

  return new Promise(function(resolve, reject) {
    youTube.search(searchWord, amount, function(error, result) {
      if (error) reject('No videos found.');

      result.items.forEach(function(item) {
        if (item.id.videoId) {
          var url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
          trackList.push(new Track(buildTrack(item, url)));
        }
      });

      var track = Helper.shuffle(trackList).find(video => {
        return video && video.url && video.title;
      });

      if (!track) return reject('No videos found from searchword ' + searchWord);
      return resolve(track);
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
