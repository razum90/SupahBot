"""
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
"""

var YAML = require('yamljs');

var exports = {};
var keystorePath = 'keystore.yml';

var keystores = [
  env,
  yml
];

var standardValues = {
  openweathermap: 'openweathermap api key',
  discord: 'discord api key',
  youtube: 'youtube api key'
};

function env(key, attributes) {
  return new Promise((resolve, reject) => {
    var prefix = 'MY_VAR_';
    var toReturn = [];

    attributes.forEach((attribute, index) => {
      var attr = prefix + attribute.toUpperCase();

      if (process.env.hasOwnProperty(attr) && process.env[attr]) {
        toReturn[attribute] = process.env[attr];
      } else {
        reject(attribute + ' key not found.');
      }

      if ((index + 1) == attributes.length) {
        resolve(toReturn);
      }
    });
  });
}

function yml(key, attributes) {
  return new Promise((resolve, reject) => {
    var toReturn = [];
    var keystore = YAML.load(keystorePath);

    if (keystore.hasOwnProperty(key)) {
      var parent = keystore[key];

      attributes.forEach((attribute, index) => {
        if (parent.hasOwnProperty(attribute) && parent[attribute] && parent[attribute] != standardValues[attribute]) {
          toReturn[attribute] = parent[attribute];
        } else {
          reject(attribute + ' key not found.');
        }

        if ((index + 1) == attributes.length) {
          resolve(toReturn);
        }
      });
    }
  });
}

exports.keys = function(key, attributes) {
  return new Promise((resolve, reject) => {
    keystores.forEach(get => {
      get(key, attributes).then(values => {
        resolve(values);
      }).catch(err => {
        if (keystores.indexOf(get) == keystores.length - 1) {
          reject(err);
        }
      });
    });
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
  return channel.members.array().filter(member => {
    return member.user.bot === false;
  }).length;
}

exports.commandIsAvailable = function(command) {
  if (!command.services) return true;
  return command.services.filter(service => {
    return service.hasUnmetDepedencies === true;
  }).length <= 0;
}

exports.wrap = function(text) {
  return '```' + text + '```';
}

exports.getRandomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = exports;
