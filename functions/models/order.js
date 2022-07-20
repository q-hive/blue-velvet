import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Order = new Schema({
    customer:   ObjectId,
    admin:      ObjectId,
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
    query: {
        byType(type) {
            return this.where({ type: type })
        }
    }
    timestamps: true
})

export default Order