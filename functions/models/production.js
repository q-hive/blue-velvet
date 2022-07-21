import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Production = new Schema({
    end:            Date,
    updated:        Date,
    orders:         [ObjectId],
    tasks:          [ObjectId],
    activeTasks:    [ObjectId],
    products: [{
        _id:        ObjectId,
        name:       String,
        prodCost:   Number,
        surplus:    Number, // * In tray numbers
    }],
},
{
    timestamps: {
        createdAt: "start"
    },
    query: {
        
    }
})

export default Production