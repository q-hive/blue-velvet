import { mongoose } from '../mongo.js'
const { Schema } = mongoose;
import Address from './address.js'

const Customer = new Schema({
    name:               { type: String,   required: false, unique: false },
    email:              { type: String,   required: false, unique: false },
    image:              { type: String,   required: false               },
    address:            { type: Address,  required: false               }
},
{
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    query: {
        
    }
})

export default Customer