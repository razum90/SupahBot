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
