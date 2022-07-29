//*COSTS SCHEMA (SEEDING TOOL)
import mongoose from 'mongoose'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Costs = Schema({
    name:       { type: String,   required: true },
    cost:       { type: Number,   required: true },
    product:    { type: ObjectId, required: true },
})

export default Costs