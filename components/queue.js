var Helper = require('./helper.js');

var exports = {};

module.exports = Queue = function() {
  var vm = this;

  vm.skipVotes = [];
  vm.queue = [];
  vm.currentDispatcher = undefined;

  Helper.keys('queue', ['maxlen', 'skipmajority']).then(values => {
    vm.maxlen = values.maxlen;
    vm.skipmajority = values.skipmajority;
    vm.admins = ['234272258934308864'];
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}

Queue.prototype.add = function(track, message) {
  this.queue.push(track);

  message.reply(Helper.wrap('Added ' + track.title + ' to the queue. (number ' + (this.queue.indexOf(track) + 1) + ')'));

  if (this.queue.length == 1) {
    this.play(message);
  }
}

Queue.prototype.isFull = function() {
  return this.queue.length >= this.maxlen;
}

Queue.prototype.play = function(message) {
  var vm = this;
  var channel = getAuthorVoiceChannel(message);

  if (!channel) {
    vm.queue = [];
    return message.reply(Helper.wrap('You are not in a voice channel.'));
  }

  var toPlay = vm.queue[0];
  if (!toPlay) {
    return message.reply(Helper.wrap('No songs in queue.'));
  }

  channel.join().then(connection => {
    var stream = toPlay.stream();

    vm.currentDispatcher = connection.playStream(stream, {
      seek: 0,
      volume: 0.5
    });

    vm.currentDispatcher.on('end', event => {
      vm.remove(message);
    });

    vm.currentDispatcher.on('error', err => {
      vm.remove(message);
    });

    vm.skipVotes = [];
    message.channel.sendMessage(Helper.wrap('Now playing: ' + toPlay.title));
  }).catch(console.error);
}

Queue.prototype.showSong = function(message) {
  var song = this.queue[0];

  if (song) {
    return message.reply(Helper.wrap('Now playing: ' + song.title + '\n' + song.url));
  } else {
    return message.reply(Helper.wrap('No song is currently playing.'));
  }
}

Queue.prototype.voteSkip = function(message) {
  var vm = this;
  var channel = getAuthorVoiceChannel(message);

  if (!vm.currentDispatcher) {
    return message.reply(Helper.wrap('No song is currently playing.'));
  }

  if (vm.admins.includes(message.member.user.id)) {
    this.currentDispatcher.end();
    return message.reply(Helper.wrap('Of course sir.'));
  }

  if (!channel) {
    return message.reply(Helper.wrap("You are not allowed to voteskip since you're not in the channel."));
  }

  if (vm.skipVotes.indexOf(message.author.id) > -1) {
    return message.reply(Helper.wrap('You have already voted to skip this song.'));
  }

  vm.skipVotes.push(message.author.id);

  var totalMembers = Helper.getTotalMembers(channel);

  if (vm.skipVotes.length / totalMembers >= vm.skipmajority) {
    this.currentDispatcher.end();
  } else {
    var votesNeeded = getAmountOfVotesNeeded(totalMembers, vm.skipVotes.length, vm.skipmajority);
    return message.reply(Helper.wrap('You need ' + votesNeeded + ' more vote(s) to skip this song.'));
  }
}

Queue.prototype.remove = function(message) {
  this.queue.shift();

  if (this.queue.length > 0) {
    this.play(message);
  } else {
    message.channel.sendMessage(Helper.wrap('No more songs in queue.'));
  }
}

function getAmountOfVotesNeeded(members, skipVotes, skipMajority) {
  var needed = 0;
  var skips = skipVotes;

  for (var i = 0; i < members; i++) {
    if (skips / members < skipMajority) {
      skips++;
      needed++;
    }
  }

  return needed;
}

function getAuthorVoiceChannel(message) {
	var voiceChannelArray = message.guild.channels.filter((v) => v.type == 'voice').filter((v) => v.members.exists('id', message.author.id)).array();

	if(voiceChannelArray.length <= 0) {
    return undefined;
  }

	return voiceChannelArray[0];
}
