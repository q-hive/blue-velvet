import mongoose from '../mongo.js'
import { Task } from './index.js'

import { addTimeToDate } from '../utils/time.js';
import { generateTasks } from '../components/tasks/store.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Production = new Schema({
    end:            { type: Date,       required: true, default: addTimeToDate(new Date(), { "w": 2 }) },
    orders:         { type: [ObjectId], required: true, default: []                                    },
    tasks:          { type: [Task],     required: true, default: generateTasks()                       },
    activeTasks:    { type: [ObjectId], required: true, default: []                                    },
    products: {
        type: [{
            _id:        { type: ObjectId, required: true },
            name:       { type: String,   required: true },
            amount:     { type: Number,   required: true }, // * Measured in packages
            surplus:    { type: Number,   required: true }, // * In tray numbers
            seed:       { type: Number,   required: true },
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