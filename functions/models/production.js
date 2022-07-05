import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const production = new Schema({
    _id:             ObjectId,
    mixing:         Boolean,
    start:          Date,
    end:            Date,
    updated:        Date,
    orders:         [ObjectId],
    tasks:          [ObjectId],
    activeTasks:    [ObjectId],
    products: [
        {
            id:         ObjectId,
            pct:        Number,
            name:       String,
            prodCost:   Number,
        }
    ],
})

export default production