import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const order = new Schema({
    customer:   ObjectId,
    owner:      ObjectId,
    date:       Date,
    type:       String, //REPETEAD ORDERS HAVE A START AND END DATE
    packages:   Number,
    price:      Number,
    start:      Date,
    end:        Date,
    containers: [ObjectId],
    production: [ObjectId],
    products:   [ObjectId],
},
{
    byType(type) {
        return this.where({ type: type })
    }
})

export default order