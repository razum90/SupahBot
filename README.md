# Welcome to SupahBot.

### This bot offers currently offers the following commands
- !music - get a link to a youtube video matching your search ```!music deep house```.
- !weather - get current weather, defaults to Stockholm ```!weather London```.
- !roll - roll from 1-100 ```!roll```.
- !help - list all commands ```!help```.
- !words - list the most common words used by a user, defaults to your user ```!words James```.
- !queue - enter a youtube URL to queue or a search word ```!queue trance``` ```!queue https://www.youtube.com/watch?v=uaCF8Qqqb0w)```.
- !voteskip - vote to skip the current song, skips depending on what your "skipmajority" field is set to in keystore.yml. Defaults
to 0,5, 50% ```!voteskip```.
- !song - get info of the current song playing, if one is playing ```!song```.

The preferred way to deploy this Bot is via Heroku. Using Heroku means that the bot doesn't run on your computer,
is active 24/7 and you don't have to worry about the ffmpeg installation. Therefore this installation guide is
going to describe how to do it.

Heroku is a service which provides servers and much, much more. Depending on your needs, the server (a.k.a. Dyno)
is free of charge the time writing this guide, it will cost you **nothing**.

### Install and deploy via Heroku
- If you don't have a github account, create one and fork this repository - then clone it
- If you don't have a Heroku account, create one and install Heroku CLI

### Before proceeding, you should create:
- A new discord app (Bot)
- A google developers account (to get a youtube API key to use for the bots playback service)
- A openweathermap account (to use the bots weather service)

Creating these accounts will cost you **nothing** aswell, by the time writing this guide.

### Step 1
- Navigate to https://discordapp.com/developers/applications/me and create a new App
- Create a bot user
- Reveal your token by clicking "click to reveal" right next to "Token"
- Save this token somewhere
- Copy your client ID and visit https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=268561430,
  replacing "YOUR_CLIENT_ID" with the client ID copied
- Join your server

### Step 2 (Recommended)
To be able to use the music playback service you need to create a google developers account
- Go to https://console.developers.google.com/ and create and account if you don't have one
- Create a project
- When created, navigate to "Credentials" and create credentials (API key)
- Save this key somewhere

### Step 3 (Recommended)
To be able to use the weather service you need to create a openweathermap account
- Go to https://home.openweathermap.org/users/sign_up and create an account
- When created, navigate to API keys and create one
- Save this key somewhere

### Step 4 Deploy to Heroku
- In the terminal, place yourself in the directory where you cloned your fork of this repository
- Login to heroku with the CLI:
```
heroku login
```
- Create a new server:
```
heroku create
```
- Add the buildpacks under .buildpacks:
```
heroku buildpacks: clear
heroku buildpacks: add https://github.com/heroku/heroku-buildpack-nodejs
heroku buildpacks: add https://github.com/issueapp/heroku-buildpack-ffmpeg
```
- Add the config variables prefixed with MY_VAR_ and UPPERCASED:
It's time to use the API keys that you **saved**:
```
heroku config:set MY_VAR_DISCORD=YOUR_DISCORD_TOKEN
heroku config:set MY_VAR_OPENWEATHERMAP=YOUR_OPENWEATHERMAP_API_KEY
heroku config:set MY_VAR_YOUTUBE=YOUR_YOUTUBE_API_KEY
```
- Deploy it:
```
git push heroku master
```
- Navigate to https://dashboard.heroku.com/ into your server and click "Configure Dynos"
- Make sure "worker node Bot.js" is switched on

Your bot should be up and **running**!

Happy botting!
