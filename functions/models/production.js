import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Production = new Schema({
    end:            Date,
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
        createdAt: "start",
        updatedAt: "updated"
    },
    query: {
        
    }
})

export default Production