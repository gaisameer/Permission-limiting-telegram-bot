const mongoose = require('mongoose')


//use this to run locally
//mongodb://127.0.0.1:27017/telegram-bot

mongoose.connect('mongodb+srv://bots:botspass123@cluster0.r3ckb.mongodb.net/premium?retryWrites=true&w=majority',
{   useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify : false
})





