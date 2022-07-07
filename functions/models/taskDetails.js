import mongoose from 'mongoose';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const taskDetails = new Schema({
    _id:            ObjectId,
    title:          String,
    description:    String,
    tools:          [String]
})

export default  taskDetails