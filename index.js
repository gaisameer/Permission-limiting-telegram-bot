const TelegramBot = require('node-telegram-bot-api')
const ms = require('ms')
const token = '1443720842:AAEucMJDoQ6JqAe5dC8nt2zbIPZYhgD2gRY';

const bot = new TelegramBot(token, {polling: true})

let c = 0

let arr = []
var premium = []
bot.on('message', (msg) => {
    
    //if(msg.chat.first_name == 'Gais')   c+=1;
    user = msg.from.id      //use id
    if(user in arr){
        arr[user] += 1
    }
    else {
        arr[user] = 1
    }

    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id, "Hello  " + msg.from.first_name);
    } 

    if(arr[msg.from.id] >=3){
        console.log("You outt");
        console.log(msg.chat.username||msg.chat.id,msg.from.id,Date.now()+ms("5m"));
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
        
    });

    bot.onText(/\/start/, (msg) => {

        bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name);
        console.log(msg.from.first_name)
            
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
    bot.onText(/\/premium/, (msg) => {
            console.log(arr);
            let ans = ""
            console.log(msg.from);
                    
            });