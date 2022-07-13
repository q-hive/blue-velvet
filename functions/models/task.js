import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

//*? Name of task must be in model
const task = new Schema({
    id:             ObjectId,
    assigned:       [ObjectId],
    currentStep:    Number,
    completed:      Boolean,
    created:        Date,
    updated:        Date,
    production:     ObjectId,
    description:    String,
    product:        [ObjectId],
    steps: [{
        step:       Number,
        assigned:   [ObjectId],
        status:     String,
        start:      Date,
        end:        Date,
        estimated:  Date
    }],
},
{
    query: {
        
    }
})

export default task