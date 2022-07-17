import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const production = new Schema({
    _id:            ObjectId,
    start:          Date,
    end:            Date,
    updated:        Date,
    orders:         [ObjectId],
    tasks:          [ObjectId],
    activeTasks:    [ObjectId],
    products: [
        {
            id:         ObjectId,
            //*PCT = % of a specefic product
            pct:        Number,
            name:       String,
            prodCost:   Number,
        }
    ],
    overProduction:{
        quant:Number, //*Number of trays
        products:[ObjectId]
    }
})

export default production