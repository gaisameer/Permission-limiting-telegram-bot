const cron = require('node-cron');
const ms = require('ms')
const express = require('express')
require('./db')
const member = require('./dbModel')
const Bot = require('node-telegram-bot-api');


let bot;
const app = express()
app.use(express.json())
const token = process.env.TOKEN;

//start the bot
if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}



//declare data
let c = 0
let arr = {}
var premium = {}
let username = {}

if(process.env.NODE_ENV !== 'production') {
    cron.schedule('* * * * * *', function() {
        console.log('---------------------');
        d = new Date()
        console.log(d.toTimeString())
      });
  }



//const messages
const helpMsg = `Command reference:
/start - Start bot (mandatory in groups)
/premium - To change a user to premium ( This should be sent as reply to a message that the user sent. This command will only work if it is used by an admin
/unban - Command to unban a user. Will only work if used by an admin
/stop - Attemt to stop bot
/about - Show information about the bot
/help - Show this help page`;


const aboutMsg = "This bot was created by @gais_ameer @sachinhere1 & @Sonusurabhi\nSource code and contact information can be found at https://github.com/sachin-in1/salesmngr_bot";



//counter reset logic

const current_info=Date.now()
let time = new Date(current_info);
let hours = time.getHours();console.log(hours)
let minutes = time.getMinutes();console.log(minutes)
let seconds = time.getSeconds();console.log(seconds)
if(hours==12 && minutes==0 && seconds==0)
    arr.clear()



//admin check
function checkadmin(msg){
    let s=msg.entities;
    bot.getChatMember(msg.chat.id, msg.from.id).then(function(data) { 
        if(s && s[0].type === 'bot_command')   //its a command
        {
            if ((data.status == "creator") || (data.status == "administrator")){
                console.log("Command send by Admin");
                return true;
                
            }
            else
               { 
                 console.log("Non admin command")
                 bot.sendMessage(msg.chat.id,"Warning : Only admin can send commands!");
                 return false; }
        }  
    });
}


//start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "bot started");


    //getting admins
    bot.getChatAdministrators(msg.chat.id)
    .then(v=>v.forEach(element => {
        if(element.user.is_bot==false && !(element.user.id  in premium) ){
            premium[element.user.id]=2
            }   
    console.log("premium    :: ",premium);
    }));
    
    //reading premium members from database
    const users = member.find({},(err, docs)=>{
        console.log(docs) 
        docs.forEach(user => {
            console.log(user.userId)
            if(!(user.userId  in premium) ){
                premium[user.userId]=1
                }
        })
     })


    });


//counter increase + block
bot.on('message', (msg) => {
    user = msg.from.id;   
    //console.log(msg.chat.id)
    if(user in arr){
        arr[user] += 1
    }
    else {
        arr[user]= 1
        username[user] = msg.from.first_name
    }
    console.log(arr); 
    if(!(user in premium)){
        if(arr[user] ==3 && msg.text.indexOf("/start")!=0){
            
            try{
            var d5 = bot.restrictChatMember(msg.chat.id,
                msg.from.id,                           
                {
                can_invite_users:false,
                can_send_messages:false,
                can_send_media_messages:false,
                can_send_polls:false,
                can_send_other_messages:false,
                can_add_web_page_previews:false,
                can_change_info:false,
                can_pin_messages:false,
                until_date:Math.round((Date.now() + ms("1 days"))/1000)});
            
                }catch(e){
                    console.log("cant remove admin")
                }
            

        }

    }

})

    
//showing count
bot.onText(/\/count/, (msg) => {

    if (checkadmin(msg)==true){
        let ans = ""
        for(var key in arr){
            console.log(key+" : " + username[key] + ":" + arr[key])
            ans += username[key] + " : " + arr[key] + "\n"
        }
        bot.sendMessage(msg.chat.id,ans)
    }
    });
//showing all count
// bot.onText(/\/cntall/, (msg) => {
//         console.log(arr);
//         let ans = ""
//         for(var key in arr){
//             console.log(key+" : " + arr[key])
//             ans += "@"+msg.from.username + " : " + arr[key] + "\n"
//         };
//         bot.sendMessage(msg.chat.id,ans)
                
//         });



//make someone premium
bot.onText(/\/premium/, (msg) =>{
        let ans = ""
        if(msg.from.id in premium && msg.reply_to_message!=null){
            if(premium[msg.from.id]==2 && msg.from.is_bot==false && !(msg.reply_to_message.from.id  in premium)){
                    premium[msg.reply_to_message.from.id]=1;
                    }
            ans +=msg.reply_to_message.from.first_name+" "+msg.reply_to_message.from.last_name +" was added to premium"
            
            bot.sendMessage(msg.chat.id,ans)
            console.log("Premium : ",premium);
            //unban 
            var d5 = bot.restrictChatMember(msg.chat.id,
                msg.reply_to_message.from.id,
                {
                can_invite_users:true,
                can_send_messages:true,
                can_send_media_messages:true,
                can_send_polls:true,
                can_send_other_messages:true,
                can_add_web_page_previews:true,
                can_change_info:true,
                can_pin_messages:true});
                arr[msg.reply_to_message.from.id]=0;
            }

            var user = new member({
                userId : msg.reply_to_message.from.id,
                groupId : msg.chat.id
            })
            try{
                    user.save()
                    console.log("saved to db :",user)
            }
            catch(e){
                console.log(e)
            }


        });

//view who is premium
bot.onText(/\/view/, (msg) =>{
    let ans = "Prime Members:\n"
    a = Object.keys(premium)
    a.forEach(element => {
        ans+=element+"\n"
    });
    bot.sendMessage(msg.chat.id,ans)
});


//unban logic
bot.onText(/\/unban/, (msg) =>{
    if(msg.from.id in premium && msg.reply_to_message!=null){
        if(premium[msg.from.id]==2 && msg.from.is_bot==false && !(msg.reply_to_message.from.id  in premium)){
                var d5 = bot.restrictChatMember(msg.chat.id,
                    msg.reply_to_message.from.id,                          
                    {
                    can_invite_users:true,
                    can_send_messages:true,
                    can_send_media_messages:true,
                    can_send_polls:true,
                    can_send_other_messages:true,
                    can_add_web_page_previews:true,
                    can_change_info:true,
                    can_pin_messages:true});
                    arr[msg.reply_to_message.from.id]=0;
            }}})


//help command
bot.onText(/\/help/, (msg) => {
    let ans = helpMsg
    bot.sendMessage(msg.chat.id,ans)
    });           
//about command     
bot.onText(/\/about/, (msg) => {
    let ans = aboutMsg
    bot.sendMessage(msg.chat.id,ans)
    });   

module.exports = bot;
