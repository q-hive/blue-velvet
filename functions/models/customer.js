import { mongoose } from '../mongo.js'
import Address from './address.js';
const { Schema } = mongoose;

const Customer = new Schema({
    name:               { type: String,   required: false, unique: false },
    email:              { type: String,   required: false, unique: false },
    image:              { type: String,   required: false               },
    address:            { type: Address,  required: false               },
    businessData:       { type: {
        name:           String,
        bankAccount:    String
    },  required: false               },
},
{
    query: {
        
    }
})

export default Customer