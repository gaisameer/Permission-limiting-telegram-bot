//const cron = require('node-cron');
const ms = require('ms')
const express = require('express')
const Bot = require('node-telegram-bot-api');
var schedule = require('node-schedule');
require('./db/db')
const member = require('./models/premiumMembers')       //model for keeping track of premium members
const counter = require('./models/messageCount')          //model for keeping track of message count


let bot;
const app = express()
app.use(express.json())
const token = process.env.TOKEN;
bot = new Bot(token, { polling: true });




//declare data
let c = 0
let arr = {}
var premium = {}
let username = {}

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
var j = schedule.scheduleJob({hour: 0, minute: 0}, function(){
    console.log('counter reset!');
    arr=[]
    counter.deleteMany({}).then((res)=>{
        console.log('counter db cleared at midnight')
    }).catch((err)=>{
        console.log('clearing db at midnight failed')
    })
  });


//admin check
function checkadmin(msg){
    bot.getChatMember(msg.chat.id, msg.from.id).then((data)=>{
        if ((data.status == "creator") || (data.status == "administrator")){
        a = true
        console.log("Command send by Admin");
    }
    else
       { 
         a = false; 
         console.log("Non admin command")
        }
        return a;
    })
        console.log(a);
}


//start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "bot started");

    premium[msg.chat.id]={}

    //getting admins
    bot.getChatAdministrators(msg.chat.id)
    .then(v=>v.forEach(element => {
        if(element.user.is_bot==false && !(element.user.id  in premium[msg.chat.id]) ){
            premium[msg.chat.id][element.user.id]=2
            }   
    console.log("premium    :: ",premium);
    }));
    
    //reading premium members from database
    const users = member.find({groupId : msg.chat.id},(err, docs)=>{
        console.log(docs) 
        docs.forEach(user => {
            console.log(user.userId)
            if(!(user.userId  in premium) ){
                premium[user.groupId][user.userId]=1
                }
        })
     })


    });


//counter increase + block
bot.on('message', (msg) => {
    user = msg.from.id;   
    
    if(user in arr){
        arr[user] += 1
         counter.findOne({userId : msg.from.id ,groupId : msg.chat.id},(err,res)=>{
             if(err){
                 console.log('failed')
             }
             if(!res)
                console.log("user in arr,but not in db")
             else{
                 console.log(res.count)
                 res.count +=1
                 res.save()
             }
         })
        
    }
    else {
        console.log("user is new..not in array")
        arr[user]= 1
        //username[user] = msg.from.first_name
        var Count = new counter({
            userId : msg.from.id,
            groupId : msg.chat.id,
            count : 1
        })
        Count.save()
       console.log("user added into db")
    }
    console.log(arr); 
    if(!(msg.chat.id in premium)){
        premium[msg.chat.id]={}
    }
    if(!(user in premium[msg.chat.id])){
        if(arr[user] ==3 && msg.text.indexOf("/start")!=0){
            
             bot.restrictChatMember(msg.chat.id,
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
                until_date:Math.round((Date.now() + ms("1 days"))/1000)}).then(()=>{
                    console.log(msg.chat.id + 'banned for 24 hrs')
                }).catch((e)=>{
                    console.log("cant ban admin")
                })
            
                
        }
    }
})

    
//showing count
bot.onText(/\/count/, (msg) => {
    var a = checkadmin(msg);
    if (a){
        let ans = ""
        for(var key in arr){
            console.log(key+" : " + username[key] + ":" + arr[key])
            ans += username[key] + " : " + arr[key] + "\n"
        }
        bot.sendMessage(msg.chat.id,ans)
    }
    else{
        bot.sendMessage(msg.chat.id,"Warning : Only admin can send commands!");
    }
    });
//make someone premium
bot.onText(/\/premium/, (msg) =>{
        let ans = ""
        if(msg.from.id in premium[msg.chat.id] && msg.reply_to_message!=null){
            if(premium[msg.chat.id][msg.from.id]==2 && msg.from.is_bot==false && !(msg.reply_to_message.from.id  in premium[msg.chat.id])){
                    premium[msg.reply_to_message.from.id]=1;
                    }
            ans +=msg.reply_to_message.from.first_name+" "+msg.reply_to_message.from.last_name +" was added to premium"
            
            bot.sendMessage(msg.chat.id,ans)
            console.log("Premium : ",premium);
            //unban 
             bot.restrictChatMember(msg.chat.id,
                msg.reply_to_message.from.id,
                {
                can_invite_users:true,
                can_send_messages:true,
                can_send_media_messages:true,
                can_send_polls:true,
                can_send_other_messages:true,
                can_add_web_page_previews:true,
                can_change_info:true,
                can_pin_messages:true}).then(()=>{
                    console.log('member ban lifted by admin..from premium function')
                }).catch((e)=>{
                    console.log('failed to lift ban..from premium function')
                })
                var value = msg.reply_to_message.from.id
                   delete arr.value
                   console.log(value , arr)
                    counter.deleteOne({ userId : msg.reply_to_message.from.id , groupId : msg.chat.id}, (err,res)=>{
                        if(err){
                            console.log('Failed to clear counter db..from premium function')
                        }else{
                            console.log('clear counter db..from premium function')
                        }
                    })
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
                console.log("failed to save preium member to db")
            }


        });

//view who is premium
bot.onText(/\/view/, (msg) =>{
    bot.getChatMember(msg.chat.id, msg.from.id).then((data)=>{
        if ((data.status == "creator") || (data.status == "administrator")){
        a = true
        console.log("Command send by Admin");
    }
    else
       { 
         a = false; 
         console.log("Non admin command")
        }
        return a;
    })
    if(a){
        let ans = "Prime Members:\n"
        a = Object.keys(premium[msg.chat.id])
        a.forEach(element => {
            ans+=element+"\n"
        });
        bot.sendMessage(msg.chat.id,ans)
    }
    else{
        bot.sendMessage(msg.chat.id,"Warning : Only admin can send commands!");
    }
});


//unban logic
bot.onText(/\/unban/, (msg) =>{
    if(msg.from.id in premium && msg.reply_to_message!=null){
        if(premium[msg.chat.id][msg.from.id]==2 && msg.from.is_bot==false && !(msg.reply_to_message.from.id  in premium[msg.chat.id])){
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
                    delete arr[msg.reply_to_message.from.id];
                    if(msg.reply_to_message.from.id in arr)
                        console.log("error value not deleted from array")
                    counter.deleteOne({ userId : msg.reply_to_message.from.id , groupId : msg.chat.id}, (err,res)=>{
                        if(err){
                            console.log('Failed to clear counter db from unban')
                        }else{
                            console.log('clear counter db from unban')
                        }
                    })

            }}})

//remove from premium    
    bot.onText(/\/remove/, (msg) =>{
    if(msg.from.id in premium[msg.chat.id] && msg.reply_to_message!=null){
        if(premium[msg.chat.id][msg.from.id]==2 && msg.from.is_bot==false && (msg.reply_to_message.from.id  in premium[msg.chat.id])){
        
        delete arr[msg.reply_to_message.from.id];       
        delete premium[msg.chat.id][msg.reply_to_message.from.id];
        if(msg.reply_to_message.from.id in premium[msg.chat.id])
            console.log("not reomved from premium")
        else
            console.log("removed from premium")
        member.deleteOne({ userId : msg.reply_to_message.from.id , groupId : msg.chat.id}, (err,res)=>{
            if(err){
                console.log('Failed to remove from premium member db.')
            }else{
                console.log('Removed from premium member db.')
            }
        })
     
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
