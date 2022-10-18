import mongoose from 'mongoose'

const {ObjectId} = mongoose.Types

const TaskPerformance = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    expected: {
        type:Number,
        required:true
    },
    achieved: {
        type:Number,
        required:true
    },
    production: {
        type:{
            products: []
        },
        required:true
    },
    workingOrders:{
        type: [ObjectId],
        required:true
    },
    breaks: {
        type:[ObjectId],
        required:true
    }
})

export default TaskPerformance