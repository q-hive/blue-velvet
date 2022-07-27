import mongoose from 'mongoose'
import Step from './step.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Task = new Schema({
    assigned:       { type: [ObjectId], required: true, default: []    },
    currentStep:    { type: Number,     required: true, default: 0     },
    completed:      { type: Boolean,    required: true, default: false },
    // * IN CASE OF PRODUCTION TASKS
    orders:         { type: [ObjectId], required: false                },
    details:        { type: ObjectId,   required: false                },
    // * IN CASE OF PRODUCTION TASKS
    product:        { type: [ObjectId], required: false                },
    steps:          { type: [Step],     required: true                 }
},
{
    timestamps: {
        createdAt: "start",
        updatedAt: "updated"
    },
    query: {
        
    }
})

export default Task