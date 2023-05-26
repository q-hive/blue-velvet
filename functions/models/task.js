import { mongoose } from '../mongo.js'
import Step from './step.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Task = new Schema({
    // executedBy:     { type: ObjectId,   required: true                  },
    expectedTime:   { type: Number,     required: true, default: false  },
    achievedTime:   { type: Number,     required: true                  },    
    orders:         { type: [ObjectId], required: false                 },
    taskType:       { type: String,     required: false                 }
})

export default Task