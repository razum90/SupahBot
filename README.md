# Welcome to SupahBot.

### This bot offers currently offers the following commands
⋅⋅* !music, get a link to a youtube video matching your search (!music deep house).
⋅⋅* !weather, get current weather, defaults to Stockholm (!weather London).
⋅⋅* !roll, roll from 1-100 (!roll).
⋅⋅* !help, list all commands (!help).
⋅⋅* !words, list the most common words used by a user, defaults to your user (!words James).
⋅⋅* !queue, enter a youtube URL to queue or a search word (!queue trance, !queue https://www.youtube.com/watch?v=uaCF8Qqqb0w).
⋅⋅* !voteskip, vote to skip the current song, skips depending on what your "skipmajority" field is set to. defaults
to 0,5, 50% (!voteskip).
⋅⋅* !song, get info of the current song playing, if one is playing (!song).

> The preferred way to deploy this Bot is via Heroku. Using Heroku means that the bot doesn't run on your computer,
> is active 24/7 and you don't have to worry about the ffmpeg installation. Therefore this installation guide is
> going to describe how to do it.

> Heroku is a service which provides servers and much, much more. Depending on your needs, the server (a.k.a. Dyno)
> is free of charge the time writing this guide, it will cost you **nothing**.

### Install and deploy via Heroku
⋅⋅1. If you don't have a github account, create one and fork this repository - then clone it
⋅⋅2. If you don't have a Heroku account, create one and install Heroku CLI

### Before proceeding, you should create:
⋅⋅1. A new discord app (Bot)
⋅⋅2. A google developers account (to get a youtube API key to use for the bots playback service)
⋅⋅3. A openweathermap account (to use the bots weather service)

> Creating these accounts will cost you **nothing** aswell, by the time writing this guide.

#### Step 1
⋅⋅1. Navigate to https://discordapp.com/developers/applications/me and create a new App
⋅⋅2. Create a bot user
⋅⋅3. Reveal your token by clicking "click to reveal" right next to "Token"
⋅⋅4. Save this token somewhere
⋅⋅5. Copy your client ID and visit https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=268561430,
  replacing "YOUR_CLIENT_ID" with the client ID copied
⋅⋅6. Join your server

#### Step 2 (Recommended)
To be able to use the music playback service you need to create a google developers account
⋅⋅1. Go to https://console.developers.google.com/ and create and account if you don't have one
⋅⋅2. Create a project
⋅⋅3. When created, navigate to "Credentials" and create credentials (API key)
⋅⋅4. Save this key somewhere

#### Step 3 (Recommended)
To be able to use the weather service you need to create a openweathermap account
⋅⋅1. Go to https://home.openweathermap.org/users/sign_up and create an account
⋅⋅2. When created, navigate to API keys and create one
⋅⋅3. Save this key somewhere

#### Deploy to Heroku
⋅⋅1. In the terminal, place yourself in the directory where you cloned your fork of this repository
⋅⋅2. Login to heroku with the CLI:
```
heroku login
```
⋅⋅3. Create a new server:
```
heroku create
```
⋅⋅4. Add the buildpacks under .buildpacks:
```
heroku buildpacks: clear
heroku buildpacks: add https://github.com/heroku/heroku-buildpack-nodejs
heroku buildpacks: add https://github.com/issueapp/heroku-buildpack-ffmpeg
```
⋅⋅5. Add the config variables prefixed with MY_VAR_ and UPPERCASED:
It's time to use the API keys that you **saved**:
```
heroku config:set MY_VAR_DISCORD=YOUR_DISCORD_TOKEN
heroku config:set MY_VAR_OPENWEATHERMAP=YOUR_OPENWEATHERMAP_API_KEY
heroku config:set MY_VAR_YOUTUBE=YOUR_YOUTUBE_API_KEY
```
⋅⋅6. Deploy it:
```
git push heroku master
```
⋅⋅7. Navigate to https://dashboard.heroku.com/, into your server and click "Configure Dynos"
⋅⋅8. Make sure "worker node Bot.js" is switched on, if it's not - turn it on.

Your bot should be up and running!

Happy botting!
