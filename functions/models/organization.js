import mongoose from 'mongoose';
import Address from './address.js'
import Container from './container.js'
import Customer from './customer.js'
import Employee from './employee.js'
import Provider from './provider.js'
import Order from './order.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Organization = new Schema({
    name:       { type: String,      required: true, unique: false  },
    owner:      { type: ObjectId,    required: true, unique: true  },
    employees:  { type: [Employee],  required: false, default: []   },
    orders:     { type: [Order],     required: false, default: []   },
    containers: { type: [Container], required: false, default: []   },
    customers:  { type: [Customer],  required: false, default: []   },
    providers:  { type: [Provider],  required: false, default: []   }, 
    address:    { type: Address,     required: true                }
},
{
    timestamps: {
        "createdAt": "created",
        "updatedAt": "updated"
    },
    query: {
        byName(name) {
            return this.where({ name: new RegExp(name, 'i') })
        },
        byOwner(owner) {
            return this.where({ owner: owner })
        }
    }
})

export default Organization