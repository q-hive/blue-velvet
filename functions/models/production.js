import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Production = new Schema({
    end:            Date,
    orders:         [ObjectId],
    tasks:          [ObjectId],
    activeTasks:    [ObjectId],
    products: {
        type: [{
            _id:        ObjectId,
            name:       String,
            prodCost:   Number,
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