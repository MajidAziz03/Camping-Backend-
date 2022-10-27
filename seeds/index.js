const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camping', {useNewUrlParser : true, useUnifiedTopology:true})

const db = mongoose.connection;
db.on("error", console.error.bind(console,"error occured in databse"))
db.once("Open", () => {
    console.log("Database Connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDb = async()=> {
    await Campground.deleteMany({})
    for(let i=0; i<50; i++){
        const random = Math.floor(Math.random()*255)
        const price = Math.floor(Math.random()*200)
        const c = new Campground({
            location : `${cities[random].city}, ${cities[random].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            image : `https://unsplash.com/photos/y8Ngwq34_Ak`,
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi porro dolor blanditiis minima illo, cum eveniet repellat et voluptates possimus maxime vitae neque quas recusandae nemo mollitia provident tenetur error veniam numquam ab?",
            price : price
        })
        await c.save()
    }
}

seedDb().then(()=>{
    mongoose.connection.close()
})


