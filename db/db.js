const mongoose = require('mongoose')


//use this to run locally
//
//mongodb+srv://bots:botspass123@cluster0.r3ckb.mongodb.net/premium?retryWrites=true&w=majority
mongoose.connect('mongodb://127.0.0.1:27017/telegram-bot',
{   useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify : false
})





