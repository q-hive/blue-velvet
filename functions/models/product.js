import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const product = new Schema({
    _id:    ObjectId,
    name:   String,
    image:  String,
    desc:   String,
    cost:   Number, // * Cost per tray,
    mix:{
        isMix:Boolean,
        name:String,
        products:[ObjectId]
    },
    parameters: {
        day:            Number, // * In hours
        night:          Number, // * In hours
        seedingRate:    Number,  
    }
})

export default product