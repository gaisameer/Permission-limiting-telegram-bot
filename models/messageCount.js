const mongoose = require('mongoose')
const { validate } = require('node-cron')

const countSchema = mongoose.Schema({
    userId : {
        type : Number,
        required : true
    },

    groupId : {
        type : Number,
        required : true
    },

    count : {
        type : Number,
        required : true
    }
},{
    timestamps : true
})

const CountDb = mongoose.model('botCount',countSchema)

module.exports = CountDb