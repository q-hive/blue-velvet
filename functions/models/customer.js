import mongoose from '../mongo.js'
const { Schema } = mongoose;

const Customer = new Schema({
    name:               { type: String,   required: true, unique: true },
    email:              { type: String,   required: true, unique: true },
    image:              { type: String,   required: true               },
    address:            { type: Address,  required: true               }
},
{

})

export default Customer