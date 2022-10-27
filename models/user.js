const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required : [true, "Email cannot be blank"]
    },

    number:{
        type : Number,
        min : 11
    }

})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)