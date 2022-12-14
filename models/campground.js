const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./reviews')

const campgroundSchema = new Schema({
    title : String,
    price : Number,
    image : String,
    description : String,
    location : String,
    reviews : [
        {
            type : Schema.Types.ObjectId, ref : 'Review'
        }
    ]
})


module.exports = mongoose.model('Campground', campgroundSchema)

