# Telegram Sales Manager Bot
This bot aims to be a simple counter bot to keep a track of no.of messages a user sends each day and restrict the user if he is a non-paid user& do nothing if he is a paid user in a group chat.  

It is currently online on http://t.me/SalesMngr_bot

## Installation
- copy the `config.js.sample` to `config.js` and enter your bot token
- `npm install`
- start the bot with the app.js (either use `node app.js` or use a manager like pm2)

## Expected behaviour
Allow non-premium users to send only one message in 24hours.

After 24 hours of message send,the restriction is lifted. 

## Current project state
Incomplete
