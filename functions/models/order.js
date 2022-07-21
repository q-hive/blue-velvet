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
        _id:    ObjectId,
        status: String,
        trays:  Number,
        seedId: {
            type:       String,
            required:   false
        },
        batch: {
            type:       String,
            required:   false,
        }
    }],
},
{
    timestamps: true,
    query: {
        byType(type) {
            return this.where({ type: type })
        }
    }
})

export default Order