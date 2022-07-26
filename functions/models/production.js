import mongoose from '../mongo.js'
import Task from './task.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Production = new Schema({
    end:            { type: Date,       required: false },
    orders:         { type: [ObjectId], required: true  },
    tasks:          { type: [Task],     required: true  },
    activeTasks:    { type: [ObjectId], required: true  },
    products: {
        type: [{
            _id:        { type: ObjectId, required: true },
            name:       { type: String,   required: true },
            amount:     { type: Number,   required: true }, // * Measured in packages
            surplus:    { type: Number,   required: true }, // * In tray numbers
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