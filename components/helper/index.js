let YAML = require('yamljs');

let keystorePath = 'keystore.yml';
let keystores = [
  env,
  yml
];

let standardValues = {
  openweathermap: 'openweathermap api key',
  discord: 'discord api key',
  youtube: 'youtube api key'
};

function env(key, attributes) {
  return new Promise((resolve, reject) => {
    let prefix = `MY_VAR_${key}_`.toUpperCase();
    let toReturn = [];

    attributes.forEach((attribute, index) => {
      let attr = prefix + attribute.toUpperCase();

      if (process.env.hasOwnProperty(attr) && process.env[attr]) {
        toReturn[attribute] = process.env[attr];
      } else {
        return reject(attribute + ' key not found.');
      }

      if ((index + 1) == attributes.length) {
        return resolve(toReturn);
      }
    });
  });
}

function yml(key, attributes) {
  return new Promise((resolve, reject) => {
    let toReturn = [];
    let keystore = module.exports.loadYaml();

    if (keystore.hasOwnProperty(key)) {
      let parent = keystore[key];

      attributes.forEach((attribute, index) => {
        if (parent.hasOwnProperty(attribute) && parent[attribute] && parent[attribute] != standardValues[attribute]) {
          toReturn[attribute] = parent[attribute];
        } else {
          return reject(attribute + ' key not found.');
        }

        if ((index + 1) == attributes.length) {
          return resolve(toReturn);
        }
      });
    } else {
      return reject(`${key} not found`)
    }
  });
}

module.exports.loadYaml = function() {
  return YAML.load(keystorePath);
}

module.exports.keys = function(key, attributes) {
  return new Promise((resolve, reject) => {
    keystores.forEach(get => {
      get(key, attributes).then(values => {
        return resolve(values);
      }).catch(err => {
        if (keystores.indexOf(get) == keystores.length - 1) {
          return reject(err);
        }
      });
    });
  });
}

module.exports.shuffle = function(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

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

module.exports.getTotalMembers = function(channel) {
  return channel.members.array().filter(member => {
    return member.user.bot === false;
  }).length;
}

module.exports.commandIsAvailable = function (command) {
  if (!command.services) return true;
  return command.services.filter(service => {
    return service.hasUnmetDepedencies === true;
  }).length <= 0;
}

module.exports.wrap = function (text) {
  return '```' + text + '```';
}

module.exports.getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
