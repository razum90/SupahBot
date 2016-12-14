var request = require('request');
var Helper = require('./helper.js');

var exports = {};

module.exports = WeatherService = function() {
  var vm = this;
  Helper.keys('apikeys', ['openweathermap']).then(function(keys) {
    vm.apikey = keys.openweathermap;
  }).catch(err => {
    console.log(err);
    vm.hasUnmetDepedencies = true;
  });
}

WeatherService.prototype.getWeather = function(city, message) {
  if (city.length > 1) {
    this.getWeatherForCity(city, message);
  } else {
    this.getWeatherForCity('Stockholm', message);
  }
}

WeatherService.prototype.getWeatherForCity = function(city, message) {
  var vm = this;
  request('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + vm.apikey + '&units=metric', (error, response, body) => {
    var weather = buildWeather(city, JSON.parse(body));
    message.reply(Helper.wrap(weather));
  });
}

function buildWeather(city, weather) {
  var toReturn = '\nWeather in ' + capitalizeFirstLetter(city);
  toReturn += '\n' + weather.weather[0].main + ', ' + weather.weather[0].description;
  toReturn += '\n' + weather.main.temp + 'C';
  return toReturn;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
