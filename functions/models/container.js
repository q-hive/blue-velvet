import { mongoose } from '../mongo.js'
import Address from './address.js' 
import Production from './production.js' 

const { Schema } = mongoose
const { ObjectId } = mongoose.Types


const Container = new Schema({
    name:           { type: String,         required: false, unique: false },
    capacity:       { type: Number,         required: true                 }, // * Measured in trays
    available:      { type: Number                                         }, // * Also in trays
    employees:      { type: [ObjectId],     required: true                 },
    production:     { type: [Production],   required: true                 },
    products:       { type: [Product],      required: true                 },
    address:        { type: Address,        required: false                }
},    
{
    timestamps: {
        createdAt: "created",
        updatedAt: "updated"
    },
    query: {
        byName(name) {
            return this.where({ name: new RegExp(name, "i") })
        },
        byAdmin(admin) {
            return this.where({ admin: admin })
        },
        byCapacity(capacity) {
            return this.where({ capacity: { $gte: capacity } })
        },
        byAvailabilty(need) {
            return this.where({ available: { $gte: need } })
        },
    }
})

export default Container