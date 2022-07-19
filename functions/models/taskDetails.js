import mongoose from 'mongoose';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const TaskDetails = new Schema({
    title:          String,
    description:    String,
    steps:          [String],   
    tools:          [String],
    admin: {
        type:       ObjectId,
        required:   false
    }
})

export default TaskDetails