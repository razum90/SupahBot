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

var Helper = require('./helper.js');

var exports = {};

module.exports = WordService = function(video) {
  this.wordsByUser = {};
}

WordService.prototype.registerMessage = function(message) {
  var vm = this;
  content = message.content;

  words = content.split(" ");
  user = message.author.username;

  if (!vm.wordsByUser[user]) {
    vm.wordsByUser[user] = [];
  }

  words.forEach(function(word) {
    vm.wordsByUser[user].push(word);
  });
}

WordService.prototype.countWordsByUser = function(args, message) {
  var vm = this;
  var words, user;

  if (args.length > 1) {
    user = args;
  } else {
    user = message.author.username;
  }

  words = vm.wordsByUser[user];

  if (words) {
    var sortedWords = getTopUsedWords(words);
    printTopUsedWords(sortedWords, message, user, 3);
  }
}

function printTopUsedWords(words, message, user, amount) {
  var toReturn = 'Top used words for ' + user + '\n';

  for (var i = 0; i < Object.keys(words).length; i++) {
    if (i + 1 <= amount) {
      toReturn += words[i][0] + ' ' + words[i][1] + ' times.\n';
    } else {
      break;
    }
  }

  message.reply(Helper.wrap(toReturn));
}

function getTopUsedWords(words) {
  var wordsFound = {};

  words.forEach(function(word) {
    if (word in wordsFound) {
      wordsFound[word] = wordsFound[word] + 1;
    } else {
      wordsFound[word] = 1;
    }
  });

  return getSortedWords(wordsFound);
}

function getSortedWords(words) {
  var sortable = [];

  for (var word in words) {
    sortable.push([word, words[word]]);
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });

  return sortable;
}
