const mongoose = require('mongoose')

const botSchema = mongoose.Schema({
    userId : {
        type : Number,
        required : true
    },

    groupId : {
        type : Number,
        required : true
    }
},{
    timestamps : true
})

const BotDb = mongoose.model('botPremium',botSchema)

module.exports = BotDb