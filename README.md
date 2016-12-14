Welcome to SupahBot.

This bot offers currently offers the following commands:

- !music
- !weather
- !roll
- !help
- !words
- !queue
- !voteskip
- !song

To install:

Step 1
- Clone this repository
- Install the latest version of Node.js

Step 2
- Navigate to https://discordapp.com/developers/applications/me and create a new App
- Create a bot user
- Reveal your token by clicking "click to reveal" right next to "Token"
- Copy that token into keystore.yml, replacing it with the standard text next to "discord"
- Copy your client ID and visit https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=268561430,
  replacing "YOUR_CLIENT_ID" with the client ID copied
- Join your server

Step 3 (optional)
If you want to take part of the music playback service this bot offers (highly recommended) you need to install ffmpeg. This works
best on a mac/linux environment.

Guide for mac
http://www.renevolution.com/ffmpeg/2013/03/16/how-to-install-ffmpeg-on-mac-os-x.html

Guide for linux
https://www.assetbank.co.uk/support/documentation/install/ffmpeg-debian-squeeze/ffmpeg-debian-jessie/

PS. I did'nt write these guides, therefore i take no credit for them nor guarantee that they work.

For the rest of you that does not use mac/linux, i'm afraid it's a matter of googling.

Step 4 (optional)
To be able to use the music playback service you need to create a google developers account
- Go to https://console.developers.google.com/ and create and account if you don't have one
- Create a project
- When created, navigate to "Credentials" and create credentials (API key)
- Copy the API key into keystore.yml, replacing it with the standard text next to "youtube"

Step 5 (optional)
To be able to use the weather service you need to create a openweathermap account
- Go to https://home.openweathermap.org/users/sign_up and create an account
- When created, navigate to API keys and create one
- Copy the API key into keystore.yml, replacing it with the standard text next to "openweathermap"

Step 6 (optional)
If you decided to do step 3 & 4, feel free to modify keystore.yml:s queue settings, you can:
- set how many songs the queue can hold at once by modifying "maxlen"
- set how much majority you need to be able to skip a song playing by modifying skipmajority (0.5 = 50%).

Step 7 (optional)
If you know your way around Heroku, this bot is ready to be deployed there. If you look under
".buildpacks", these are the buildpacks that needs to be set on the Heroku dyno. Also, you need to
enable "worker" under Dyno information and disable "web". If you choose to deploy it to Heroku,
SupahBot is prepared to read in the API keys from there instead via config variables. They should
be prefixed with "MY_VAR_" + the name from the keystore.yml file, uppercased.

When you are ready to start your Bot (if your gonna run it from your computer), navigate to this cloned
directory in your terminal and Type "node Bot.js".

Happy botting!
