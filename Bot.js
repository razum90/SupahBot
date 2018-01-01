var Discord = require('discord.js');
var Bot = new Discord.Client();
var Helper = require('./components/helper.js');
var Queue = require('./components/queue.js');
var TrackHelper = require('./components/trackhelper.js');
var WordService = require('./components/wordservice.js');
var WeatherService = require('./components/weatherservice.js');

var commands = {
  '!video': {
    execute: getVideo,
    description: 'get a youtube video by search word'
  },
  '!weather': {
    execute: getWeather,
    description: 'get current weather for the given city, defaults to Stockholm'
  },
  '!roll': {
    execute: roll,
    description: 'roll from 1-100'
  },
  '!help': {
    execute: showHelp
  },
  '!words': {
    execute: countWordsByUser,
    description: 'get the most popular words for user of the given username, defaults to your username'
  },
  '!queue': {
    execute: doQueue,
    description: 'queue your song'
  },
  '!voteskip': {
    execute: voteSkip,
    description: 'vote to skip the current song'
  },
  '!song': {
    execute: showSong,
    description: 'get the current song'
  }
};

Bot.on('message', message => {
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
    TrackHelper.getVideoFromUrl(args).then(track => {
      Queue.add(track, message);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  } else {
    TrackHelper.getRandomTrack(args, 5).then(track => {
      Queue.add(track, message);
    }).catch(err => {
      message.reply(Helper.wrap(err));
    });
  }
}

function getVideo(args, message) {
  TrackHelper.getRandomTrack(args, 5).then(track => {
    message.reply(track.url);
  }).catch(err => {
    message.reply(Helper.wrap(err));
  });
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
        toReturn += command + ': ' + data.description + getAvailableCommandAsText(data) + '\n';
      }
    }
  }
  message.reply(Helper.wrap(toReturn));
}

function getAvailableCommandAsText(command) {
  if (!Helper.commandIsAvailable(command)) return ' (not available)';

  return '';
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
  var command = commands[args[0]];
  if (command) executeCommand(command, message, args);
}

function executeCommand(command, message, args) {
  if (!Helper.commandIsAvailable(command)) {
    return message.reply(Helper.wrap('Command is not available.'));
  }

  command.execute(getCommandArguments(args), message);
}

function getCommandArguments(args) {
  var withoutCommand = args.slice(1);

  return withoutCommand.join(" ");
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function registerService(service, affectedCommands) {
  service = new service();

  if (affectedCommands) {
    affectedCommands.forEach(command => {
      var c = commands[command];
      if (c) {
        if (!c.services) c.services = [];
        c.services.push(service);
      }
    });
  }

  return service;
}

function init() {
  Helper.keys('apikeys', ['discord']).then(keys => {
    Bot.login(keys.discord);

    Queue = registerService(Queue, ['!queue', '!voteskip', '!song']);
    TrackHelper = registerService(TrackHelper, ['!queue', '!video']);
    WordService = registerService(WordService, ['!words']);
    WeatherService = registerService(WeatherService, ['!weather']);
  }).catch(console.error);
}

init();
