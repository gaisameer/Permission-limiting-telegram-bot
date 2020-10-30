const TelegramBot = require('node-telegram-bot-api')

const token = '1443720842:AAEucMJDoQ6JqAe5dC8nt2zbIPZYhgD2gRY';

const bot = new TelegramBot(token, {polling: true})

let c = 0

let arr = []

bot.on('message', (msg) => {
    
    //if(msg.chat.first_name == 'Gais')   c+=1;
    user = msg.from.first_name      //use id
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

    
        
    });

    bot.onText(/\/start/, (msg) => {

        bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name);
        console.log(msg.from.first_name)
            
        });


    bot.onText(/\/count/, (msg) => {

        let ans = ""
        //bot.sendMessage(msg.from.id,"Gais sent " + c + " messages.")
        for(var key in arr){
            console.log(key + " : " + arr[key])
            ans += key + " : " + arr[key] + "\n"
        }
        bot.sendMessage(msg.chat.id,ans)
                
        });