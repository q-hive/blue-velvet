import mongoose from '../mongo.js';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const TaskDetails = new Schema({
    title:          { type: String,   required: true  },
    description:    { type: String,   required: true  },
    steps:          { type: [String], required: true  },   
    tools:          { type: [String], required: true  },
    admin:          { type: ObjectId, required: false }
})

export default TaskDetails