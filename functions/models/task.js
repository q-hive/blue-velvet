import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Task = new Schema({
    assigned:       [ObjectId],
    currentStep:    Number,
    completed:      Boolean,
    created:        Date,
    updated:        Date,
    orders: {  // * IN CASE OF PRODUCTION TASKS         {
        type:       [ObjectId],
        required:   false
    },
    details:        ObjectId,
    product: {  // * IN CASE OF PRODUCTION TASKS         {
        type:       [ObjectId],
        required:   false
    },
    steps: [{
        step:       Number,
        assigned:   [ObjectId],
        status:     String,
        start:      Date,
        end:        Date,
        estimated:  Number // * Measured in hours
    }],
},
{
    query: {
        
    }
})

export default Task