import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Production = new Schema({
    end:            Date,
    orders:         [ObjectId],
    container:      ObjectId,
    tasks:          [ObjectId],
    activeTasks:    [ObjectId],
    available:      Number, // * Starts as max and is for tracking purposes
    max:            Number, // * Starts at max available space for container 
    products: {
        type: [{
            _id:        ObjectId,
            name:       String,
            prodCost:   Number,
            trays:      Number,
            surplus:    Number, // * In tray numbers
        }],
        required: true
    }
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