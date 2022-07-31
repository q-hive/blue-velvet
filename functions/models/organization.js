import mongoose from 'mongoose';
import { Address, Container, Customer, Employee, Provider } from './index.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Organization = new Schema({
    name:       { type: String,      required: true, unique: true  },
    owner:      { type: ObjectId,    required: true, unique: true  },
    employees:  { type: [Employee],  required: true, default: []   },
    orders:     { tpye: [Order],     required: true, default: []   },
    containers: { type: [Container], required: true, defualt: []   },
    customers:  { type: [Customer],  required: true, default: []   },
    providers:  { type: [Provider],  required: true, default: []   }, 
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