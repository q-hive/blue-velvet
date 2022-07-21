import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Order = new Schema({
    customer:   ObjectId,
    admin:      ObjectId,
    date:       Date,
    updated:    Date,
    type:       String, // REPETEAD ORDERS HAVE A START AND END DATE
    packages:   Number,
    price:      Number,
    start:      Date,
    end:        Date,
    containers: [ObjectId],
    production: [ObjectId],
    products:   [{
        _id: ObjectId,
        status: String,
        seedId: String,
        batch: {
            type:       String,
            required:   false,
        }
    }],
},
{
    byType(type) {
        return this.where({ type: type })
    }
})

export default Order