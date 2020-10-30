const TelegramBot = require('node-telegram-bot-api')
const ms = require('ms')
const token = '1443720842:AAEucMJDoQ6JqAe5dC8nt2zbIPZYhgD2gRY';

const bot = new TelegramBot(token, {polling: true})

let c = 0
let arr = {}
var premium = {}
bot.on('message', (msg) => {
    
    user = msg.from.id      //use id
    console.log(arr);
    if(user in arr){
        arr[user][0] += 1
        // if(arr[user][1]!=msg.from.username){
        //     arr[user][1]=msg.from.username
        // }
    }
    else {
        arr[user]= 1
        // arr[user]=msg.from.username
    }

    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id, "Hello  " + msg.from.first_name);
    } 

    if(!(msg.from.id in premium)){
        if(arr[msg.from.id] >=3){
            bot.sendMessage(msg.chat.id, "You outt  " + msg.from.first_name+" from "+msg.chat.id+"("+"@"+msg.chat.username+")");
            bot.restrictChatMember(msg.chat.id,
            msg.from.id,{until_date:Date.now()+ms("5m"),
            can_send_messages:false,
            can_send_media_messages:false,
            can_send_polls:false,
            can_send_other_messages:false,
            can_add_web_page_previews:false,
            can_change_info:false,
            can_invite_users:false,
            can_pin_messages:false});
        }
        }
    });

    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name);

        bot.getChatAdministrators(msg.chat.id)
        .then(v=>v.forEach(element => {
            if(element.user.is_bot==false && !(element.user.id  in premium) ){
                premium[element.user.id]=2
                }
        console.log("okeee ",premium);
        }));
        });

    bot.onText(/\/count/, (msg) => {

        let ans = ""
        //bot.sendMessage(msg.from.id,"Gais sent " + c + " messages.")
        for(var key in arr){
            console.log(key+" : " + arr[key])
            ans += "@"+msg.from.username + " : " + arr[key] + "\n"
        }
        bot.sendMessage(msg.chat.id,ans)
                
        });
    
    bot.onText(/\/cntall/, (msg) => {
            console.log(arr);
            let ans = ""
            //bot.sendMessage(msg.from.id,"Gais sent " + c + " messages.")
            for(var key in arr){
                console.log(key+" : " + arr[key])
                ans += "@"+msg.from.username + " : " + arr[key] + "\n"
            };
            bot.sendMessage(msg.chat.id,ans)
                    
            });
    // bot.onText(/\/admincheck/, (msg) =>{
    //         let ans = ""
    //         // console.log(msg.from);

    //         });
    bot.onText(/\/premium/, (msg) =>{
            let ans = ""
            console.log(msg);
            if(msg.from.id in premium && msg.reply_to_message!=null){
                if(premium[msg.from.id]==2 && msg.from.is_bot==false && !(msg.reply_to_message.from.id  in premium)){
                        premium[msg.reply_to_message.from.id]=1;
                        }
                ans +=msg.reply_to_message.from.first_name+" "+msg.reply_to_message.from.last_name +" was added to premium"
                
                bot.sendMessage(msg.chat.id,ans)
                console.log("Premium : ",premium);
                }
            });
    bot.onText(/\/view/, (msg) =>{
        let ans = "Prime Members:\n"
        a = Object.keys(premium)
        a.forEach(element => {
            ans+=element+"\n"
        });
        bot.sendMessage(msg.chat.id,ans)
    });