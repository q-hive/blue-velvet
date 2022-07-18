import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const order = new Schema({
    customer:   ObjectId,
    owner:      ObjectId,
    date:       Date,
    type:       String,
    packages:   Number,
    price:      Number,
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