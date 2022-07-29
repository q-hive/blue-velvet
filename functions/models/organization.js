import mongoose from 'mongoose';
import Address from './address.js'
import Container from './container.js'
import Employee from './employee.js'
import Provider from './provider.js'
import Order from './order.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Organization = new Schema({ 
    name:       { type: String,      required: true, unique: true  },
    owner:      { type: ObjectId,    required: true, unique: true  },
    employees:  { type: [Employee],  required: true                },
    orders:     { type: [Order],     required: true, unique: true  },
    containers: { type: [Container], required: true, unique: true  },
    customers:  { type: [ObjectId],  required: true, unique: true  },
    providers:  { type: [Provider],  required: true, unique: true  }, 
    address:    { type: [Address],   required: true                }
},
{
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