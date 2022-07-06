import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const container = new Schema({
    id:         ObjectId,
    name:       String,
    admin:      ObjectId,
    address:    String,
    capacity:   Number, // * Measured in trays
    employees:  [ObjectId],
    prodLines:  [ObjectId],
    products: [{
        _id:    ObjectId,
        trays:  Number
    }],
    location: {
        latitude:   Number,
        longitude:  Number
    },
})

export default container