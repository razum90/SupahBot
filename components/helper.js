YAML = require('yamljs');

var exports = {};
var keystorePath = 'keystore.yml';

exports.key = function(key, attribute) {
  return new Promise(function(resolve, reject) {
    keystore = YAML.load(keystorePath);

    if (keystore.hasOwnProperty(key)) {
      parent = keystore[key];

      if (parent.hasOwnProperty(attribute)) {
        resolve(parent[attribute]);
      } else {
        reject(attribute + ' not found in ' + key + '.');
      }
    } else {
      reject(key + ' not found.');
    }
  });
}

exports.standardValues = function() {
  return {
    openweathermap: 'openweathermap api key',
    discord: 'discord api key',
    youtube: 'youtube api key'
  };
}

exports.keys = function(key, attributes) {
  var toReturn = [];

  return new Promise(function(resolve, reject) {
    keystore = YAML.load(keystorePath);

    if (keystore.hasOwnProperty(key)) {
      parent = keystore[key];

      attributes.forEach(function(attribute) {
        if (parent.hasOwnProperty(attribute)) {
          toReturn[attribute] = parent[attribute];
        } else {
          reject(attribute + ' not found.');
        }
      });
    } else {
      reject(key + ' not found.');
    }

    resolve(toReturn);
  });
}

exports.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

exports.getTotalMembers = function(channel) {
  var membersLength = 0;

  channel.members.array().forEach(function(member) {
    if (!member.user.bot) {
      membersLength++;
    }
  });

  return membersLength;
}

exports.wrap = function(text) {
  return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}

exports.getRandomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = exports;
