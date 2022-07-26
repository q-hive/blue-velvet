import mongoose from '../mongo.js'

const { Schema } = mongoose
const { ObjectId } = mongoose.Types 

const Step = new Schema({
    step:       { type: Number,     required: true                   },
    assigned:   { type: [ObjectId], required: true, default: []      },
    status:     { type: String,     required: true, default: "To-do" },
    estimated:  { type: Number,     required: true, default: 0       } // * Measured in hours
},
{
    timestamps: {
        createdAt: "start",
        updatedAt: "updated"
    },
    query: {
        byAssigned(employee) {
            return this.where({ assigned: { $in: employee } })
        },
        byStep(step) {
            return this.where({ step: step })
        }
    }
})

export default Step