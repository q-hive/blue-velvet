import mongoose from 'mongoose';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

console.log("Task details initializing")

const TaskDetails = new Schema({
    title:          { type: String,   required: true  },
    description:    { type: String,   required: true  },
    steps:          { type: [String], required: true  },   
    tools:          { type: [String], required: true  },
    admin:          { type: ObjectId, required: false }
})

export default TaskDetails