# Welcome to SupahBot.

### This bot is written in combination with Discord.js.

| Command         | Description                                          | Example           |
| :-------------: |:-----------------------------------------------------| :----------------:|
| !video          | get a link to a youtube video matching your search   | `!video funny`    |
| !weather        | get current weather, defaults to Stockholm           | `!weather London` |
| !roll           | roll from 1-100                                      | `!roll`           |
| !help           | list all commands                                    | `!help`           |
| !words          | list the most common words by user, defaults to you  | `!words John`     |
| !queue          | enter a youtube URL to queue or a search word        | `!queue house`    |
| !voteskip       | vote to skip the current song                        | `!voteskip`       |
| !song           | get the URL & title of the current song              | `!song`           |

## The accounts
- A new discord app (Bot) (required)
- A google developers account (to get a youtube API key to use for the bots playback service)
- A openweathermap account (to use the bots weather service)

### Step 1
- Navigate to https://discordapp.com/developers/applications/me and create a new App
- Create a bot user
- Navigate to the Bot section in the left menu
- Reveal your token by clicking "click to reveal token" right beneath "Token"
- Save this token somewhere
- Copy your client ID and visit https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=268561430,
  replacing "YOUR_CLIENT_ID" with the client ID copied
- Join your server

**NOTE: The bot can run without the weather and the playback service!**

### Step 2 (Recommended)
To be able to use the music playback service you need to create a google developers account
- Go to https://console.developers.google.com/ and create and account if you don't have one
- Create a project
- When created, navigate to "Credentials" and create credentials (API key)
- Enable the youtube data API
- Save this key somewhere

### Step 3 (Recommended)
To be able to use the weather service you need to create a openweathermap account
- Go to https://home.openweathermap.org/users/sign_up and create an account
- When created, navigate to API keys and create one
- Save this key somewhere

## Running the bot
The bot should be ran through docker. Docker handles all dependencies of the bot itself no matter your operating system and is just the easiest way to run the bot.

### Locally
[Install docker](https://www.docker.com/)
#### If you want to make changes to the bot
- Clone/Fork this repository
- In the terminal, place yourself in the directory where you cloned your fork/clone of this repository
- After any changes to the bot, run the following commands to rebuild and run it
```
docker build . -t supahbot
docker run -d -e MY_VAR_COMMAND_ID='<your-command-id>' \
  -e MY_VAR_APIKEYS_DISCORD='<your-discord-key>' \
  -e MY_VAR_ADMIN_IDS='<your-admin-ids>' \
  supahbot
```
#### If you just want to run it
```
docker pull razumkay/supahbot
docker run -d -e MY_VAR_COMMAND_ID='<your-command-id>' \
  -e MY_VAR_APIKEYS_DISCORD='<your-discord-key>' \
  -e MY_VAR_ADMIN_IDS='<your-admin-ids>' \
  razumkay/supahbot
```

For more information about handling docker containers, i refer to the [docker documentation](https://docs.docker.com/).

**NOTE: For a list of all supported environment variables, check the table below**

### Remotely
There is a bunch of services online that allows deployment of docker containers. Some of them are even for free. I would recommend the following:
- [AWS](https://aws.amazon.com/docker/)
- [Google Cloud](https://cloud.google.com/run/docs/deploying)
- [Heroku](https://devcenter.heroku.com/categories/deploying-with-docker)

## Configuration env variables

**Every variable has to be prefixed with MY_VAR in order to be recognized.**

| Variable                   | Description                                                                          |
| :------------------------: |:------------------------------------------------------------------------------------:|
| `APIKEYS_DISCORD`          | discord apikey                                                                       |
| `APIKEYS_OPENWEATHERMAP`   | openweathermap apikey                                                                |
| `APIKEYS_YOUTUBE`          | youtube apikey                                                                       |
| `ADMIN_IDS`                | list of comma separated user id:s that should be concidered admins                   |
| `QUEUE_SKIPMAJORITY`       | a number between 0 and 1 to represent the majority needed to skip a song (0.1 = 10%) |
| `QUEUE_MAXLEN`             | max length of song queue                                                             |
| `COMMAND_ID`               | character to identify bot commands with, defaults to !                               |
