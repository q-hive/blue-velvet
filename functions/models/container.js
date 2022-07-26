import mongoose from '../mongo.js'
import Order from './order.js'
import Production from './production.js'

const { Schema } = mongoose
const { ObjectId } = mongoose.Types


const Container = new Schema({
    name:           { type: String,         required: true, unique: true },
    admin:          { type: ObjectId,       required: true },
    organization:   { type: ObjectId,       required: true },
    capacity:       { type: Number,         required: true }, // * Measured in trays
    available:      { type: Number,         required: true }, // * Also in trays
    employees:      { type: [ObjectId],     required: true },
    orders:         { type: [Order],        required: true },
    production:     { type: [Production],   required: true },
    address: {
        type: {
            stNumber:   { type: String, required: true },
            street:     { type: String, required: true },
            zip:        { type: String, required: true },
            city:       { type: String, required: true },
            state:      { type: String, required: true },
            country:    { type: String, required: true },
            references: { type: String, required: true }
        },
        required: false
    },
    location: {
        type: {
            latitude:   { type: Number, required: true },
            longitude:  { type: Number, required: true }
        },
        required: false
    }
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
        byOrganization(orgId) {
            return this.where({ organization: orgId })
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