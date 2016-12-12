var Discord = require('discord.js');
var Bot = new Discord.Client();
var request = require('request');
var Helper = require('./components/helper.js');
var Queue = require('./components/queue.js');
var TrackHelper = require('./components/trackhelper.js');
var WordService = require('./components/wordservice.js');
var WeatherService = require('./components/weatherservice.js');

var commands = {
  '!music': {
    execute: getMusic,
    description: 'get music of the given genre.'
  },
  '!weather': {
    execute: getWeather,
    description: 'get current weather for the given city, defaults to Stockholm.'
  },
  '!roll': {
    execute: roll,
    description: 'roll from 1-100.'
  },
  '!help': {
    execute: showHelp
  },
  '!words': {
    execute: countWordsByUser,
    description: 'get the most popular words for user of the given username, defaults to your username.'
  },
  '!queue': {
    execute: doQueue,
    description: 'queue your song.'
  },
  '!voteskip': {
    execute: voteSkip,
    description: 'vote to skip the current song.'
  },
  '!song': {
    execute: showSong,
    description: 'get the current song'
  }
};

Bot.on('message', function(message) {
  WordService.registerMessage(message);

  if (isBotCommand(message)) {
    execute(message.content, message);
  }
});

function showSong(args, message) {
  Queue.showSong(message);
}

function voteSkip(args, message) {
  Queue.voteSkip(message);
}

function doQueue(args, message) {
  if (args.length <= 0) {
    return message.reply(Helper.wrap('Type of music need to be specified.'));
  }

  if (Queue.isFull()) {
    return message.reply(Helper.wrap('Queue is full.'));
  }

  if (args.startsWith('http')) {
    TrackHelper.getVideoFromUrl(args).then(function(track) {
      Queue.add(track, message);
    }).catch(console.error);
  } else {
    TrackHelper.getRandomVideo(args, 5).then(function(track) {
      Queue.add(track, message);
    }).catch(console.error);
  }
}

function getMusic(args, message) {
  TrackHelper.getRandomVideo(args, 5).then(function(track) {
    message.reply(track.url);
  })
}

function countWordsByUser(args, message) {
  WordService.countWordsByUser(args, message);
}

function getWeather(args, message) {
  WeatherService.getWeather(args, message);
}

function showHelp(args, message) {
  var toReturn = 'No commands to run!';
  if (Object.keys(commands).length > 1) {
    var toReturn = 'Available commands:\n';
    for (var command in commands) {
      if (command != '!help') {
        data = commands[command];
        toReturn += command + ': ' + data.description + '\n';
      }
    }
  }
  message.reply(Helper.wrap(toReturn));
}

function roll(content, message) {
  message.reply(Helper.wrap('You rolled ' + getRandomNumber(1, 100) + ' (1-100)'));
}

function isBotCommand(message) {
  if (message.content.startsWith('!') && message.author.id != Bot.user.id) {
    return true;
  }

  return false;
}

function execute(content, message) {
  var args = content.split(" ");
  var commandToRun = args[0];

  for (var command in commands) {
    if (command == commandToRun) {
      commands[command].execute(getCommandArguments(args), message);
    }
  }
}

function getCommandArguments(args) {
  var withoutCommand = args.slice(1);

  return withoutCommand.join(" ");
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init() {
  Helper.key('apikeys', 'discord').then(function(key) {
    if (key == Helper.standardValues().discord) {
      throw 'Discord api key not set, bot cannot load.';
    }

    Bot.login(key);
    Queue = new Queue();
    TrackHelper = new TrackHelper();
    WordService = new WordService();
    WeatherService = new WeatherService();
  }).catch(console.error);
}

init();
