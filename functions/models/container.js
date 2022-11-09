import { mongoose } from '../mongo.js'
import Address from './address.js' 
import Product from './product.js'
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

//** Container has the products that manages, when order is received, insert a new production line into array
//** Container tasks are in production. User must retrieve data from container production lines array */ 