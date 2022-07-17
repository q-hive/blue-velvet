import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const production = new Schema({
    _id:            ObjectId,
    start:          Date,
    end:            Date,
    updated:        Date,
    surplus:        Number,
    orders:         [ObjectId],
    tasks:          [ObjectId],
    activeTasks:    [ObjectId],
    products: [
        {
            id:         ObjectId,
            name:       String,
            prodCost:   Number,
            surplus:    Number, // * In tray numbers
        }
    ],
},
{
    query: {
        
    }
})

export default production