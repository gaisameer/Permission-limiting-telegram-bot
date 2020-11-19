const cron = require('node-cron');
const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

// bot.on('message', (msg) => {
//   const name = msg.from.first_name;
//   bot.sendMessage(msg.chat.id, 'Helloi, ' + name + '!').then(() => {
//   });
// });
let c = 0
let arr = {}
var premium = {}
let username = {}

cron.schedule('* 1 * * * *', function() {
    console.log('---------------------');
    console.log('Running Cron Job');
    bot.sendMessage(315104882,"working hook?")
  });

const helpMsg = `Command reference:
/start - Start bot (mandatory in groups)
/premium - To change a user to premium ( This should be sent as reply to a message that the user sent. This command will only work if it is used by an admin
/unban - Command to unban a user. Will only work if used by an admin
/stop - Attemt to stop bot
/about - Show information about the bot
/help - Show this help page`;


const aboutMsg = "This bot was created by @gais_ameer @sachinhere1 & @Sonusurabhi\nSource code and contact information can be found at <url>";

//msg send by admin or not

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

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "bot started");

    bot.getChatAdministrators(msg.chat.id)
    .then(v=>v.forEach(element => {
        if(element.user.is_bot==false && !(element.user.id  in premium) ){
            premium[element.user.id]=2
            }
            
        
    console.log("premium    :: ",premium);
    }));
    });

bot.on('message', (msg) => {
    user = msg.from.id;      
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

            

        }

    }

})

    

    bot.onText(/\/count/, (msg) => {

        if (checkadmin(msg)==1){
            let ans = ""
            for(var key in arr){
                console.log(key+" : " + username[key] + ":" + arr[key])
                ans += username[key] + " : " + arr[key] + "\n"
            }
            bot.sendMessage(msg.chat.id,ans)
    }
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
            //console.log(msg);
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
            });
    bot.onText(/\/view/, (msg) =>{
        let ans = "Prime Members:\n"
        a = Object.keys(premium)
        a.forEach(element => {
            ans+=element+"\n"
        });
        bot.sendMessage(msg.chat.id,ans)
    });
    
    bot.onText(/\/unban/, (msg) =>{
        if(msg.from.id in premium && msg.reply_to_message!=null){
            if(premium[msg.from.id]==2 && msg.from.is_bot==false && !(msg.reply_to_message.from.id  in premium)){
                    //premium[msg.reply_to_message.from.id]=1;
                    //arr[msg.chat.id]= 0
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



                bot.onText(/\/help/, (msg) => {
                    let ans = helpMsg
                    bot.sendMessage(msg.chat.id,ans)
                    });                
                bot.onText(/\/about/, (msg) => {
                    let ans = aboutMsg
                    bot.sendMessage(msg.chat.id,ans)
                    });  

module.exports = bot;
