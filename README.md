# Telegram Sales Manager Bot

This bot aims to be a simple counter bot to keep a track of no.of messages a user sends each day and restrict the user if he is a non-paid user& do nothing if he is a paid user in a group chat.  

It is currently online on http://t.me/SalesMngr_bot .
- To make use of the bot, add the bot to your supergroup, give it admin privilages& type in `/start` (not right now tho)

## Expected behaviour

- Allow non-premium users to send only one message in 24hours.
- After 24 hours of message send,the restriction is lifted. 

## Commands

These commands are expected to work on telegram supergroups only

- /start : Command to startup the bot. This command can be used to update the list of admins also
- /view : Command to view the members who are having the premium privilages currently
- /premium : Command to add a member to premium (select any message sent by the user & reply to the message with this command)
- /count : Command to show how many messages was sent by each of the users
- /help : Command to show the help section


## Current project state
Incomplete
