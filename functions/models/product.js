import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const product = new Schema({
    _id:    ObjectId,
    name:   String,
    image:  String,
    desc:   String,
    cost:   Number, // * Cost per tray
    parameters: {
        day:            Number, // * In hours
        night:          Number, // * In hours
        seedingRate:    Number,  
    }
})

export default product