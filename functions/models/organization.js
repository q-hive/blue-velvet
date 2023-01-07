import mongoose from 'mongoose';
import Address from './address.js'
import Customer from './customer.js'
import Employee from './employee.js'
import Provider from './provider.js'
import Order from './order.js'
import Container from './container.js'
import Task from './task.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Organization = new Schema({
    name:           { type: String,         required: true, unique: false      },
    owner:          { type: ObjectId,       required: true, unique: true       },
    employees:      { type: [Employee],     required: false                    },
    containers:     { type: [Container],    required: false                    },
    customers:      { type: [Customer],     required: false, unique: false     },
    providers:      { type: [Provider],     required: false                    }, 
    orders:         { type: [Order],        required: false                    },
    address:        { type: Address,        required: true                     },
    packaging:      { type: [{type: ObjectId, unique:true}],             required: false                    },
    deliveryReady:  { type: [{type: ObjectId, unique:true}],             required: false                    },
    invoices:       { type:[],              required:false                     },
    tasksHistory:   { type: [{
        executedBy:     { type: ObjectId,   required: true, unique: false      },
        expectedTime:   { type: Number,     required: true, default: false     },
        achievedTime:   { type: Number,     required: true                     },    
        orders:         { type: [ObjectId], required: false                    },
        taskType:       { type: String,     required: false                    },
        workDay:        { type: Date,       required: true                     }
    }],                                     required: false                    },
    
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
    },
    validateBeforeSave:false
},
)

export const organizationModel = new mongoose.model('organization', Organization)

export default Organization