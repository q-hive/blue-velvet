import mongoose from 'mongoose'
import TaskPerformance from './TaskPerformance.js'

const {ObjectId} = mongoose.Types

const GlobalWorkDay = new mongoose.Schema({
    Meta: {
        type: {
            WorkDay: Date,
            Started: Date,
            Finished: Date,
            Breaks: [ObjectId],
            Tasks:  [ObjectId]
        },
        required: true
    },
    Tasks: {
        type:TaskPerformance
    }

})

export default GlobalWorkDay