const TelegramBot = require('node-telegram-bot-api')
//const ms = require('ms')
//const moment = require('moment');
//const { now } = require('moment');

const token = '1443720842:AAEucMJDoQ6JqAe5dC8nt2zbIPZYhgD2gRY';

const bot = new TelegramBot(token, {polling: true})

let c = 0
let arr = {}
var premium = {}
let username = {}



bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name);

    bot.getChatAdministrators(msg.chat.id)
    .then(v=>v.forEach(element => {
        if(element.user.is_bot==false && !(element.user.id  in premium) ){
            premium[element.user.id]=2
            }
    console.log("premium    :: ",premium);
    }));
    });


bot.on('message', (msg) => {
    user = msg.from.id;      //use id

    if(user in arr){
        arr[user] += 1
    }
    else {
        arr[user]= 1
        username[user] = msg.from.first_name
    }
    console.log(arr);
    // let per = {can_send_messages:false,
    //     can_send_media_messages:false,
    //     can_send_polls:false,
    //     can_send_other_messages:false,
    //     can_add_web_page_previews:false,
    //     can_change_info:false,
    //     can_invite_users:false,
    //     can_pin_messages:false}

    if(!(user in premium)){
        if(arr[user] =1 && msg.text != "/start"){
            //let x = telegramBot.restrictChatMember(msg.chat.id, user,per,moment.unix(new Date).add(1, 'day'))
            
            var d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(0, 0, 0);
            d.setMilliseconds(0);
            
            console.log(new Date)
            console.log(d);

            // var d5 = new Date();
            // d5.setMinutes(d5.getMinutes + 2)
            
            
            // console.log(new Date)
            // console.log(unix(new Date))
            // console.log(moment.unix(new Date).add(1,'day'))
            //const stat = 
            bot.restrictChatMember(msg.chat.id,
                msg.from.id,                            //Date.now()+ms("5m"),
                {
                can_invite_users:false,
                can_send_messages:false,
                can_send_media_messages:false,
                can_send_polls:false,
                can_send_other_messages:false,
                can_add_web_page_previews:false,
                can_change_info:false,
                can_pin_messages:false},d);
                //console.log(d5)
        }

    }

})




   /* var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id, "Hello  " + msg.from.first_name);
    } */

    /*
    if(!(msg.from.id in premium)){
        if(arr[msg.from.id] >=3){
            bot.sendMessage(msg.chat.id, "You outt  " + msg.from.first_name+" from "+msg.chat.id+"("+"@"+msg.chat.username+")");
            
            const releaseDate = moment.unix(new Date).add(1, 'minute');
            console.log(releaseDate)
            const stat = bot.restrictChatMember(msg.chat.id,
            msg.from.id,{until_date:releaseDate.unix(),                            //Date.now()+ms("5m"),
            can_send_messages:false,
            can_send_media_messages:false,
            can_send_polls:false,
            can_send_other_messages:false,
            can_add_web_page_previews:false,
            can_change_info:false,
            can_invite_users:false,
            can_pin_messages:false});

            console.log(stat)
        }  
        }
    }); */

    

    bot.onText(/\/count/, (msg) => {

        let ans = ""
        //bot.sendMessage(msg.from.id,"Gais sent " + c + " messages.")
        for(var key in arr){
            console.log(key+" : " + username[key] + ":" + arr[key])
            ans += username[key] + " : " + arr[key] + "\n"
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