import mongoose from 'mongoose';
import Address from './address.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Organization = new Schema({ 
    name:       { type: String,     required: true, unique: true },
    admin:      { type: ObjectId,   required: true },
    employees:  { type: [ObjectId], required: true },
    containers: { type: [ObjectId], required: true, unique: true }, 
     // ? Dont know if address is required
    address:    { type: Address,    required: false              }
},
{
    query: {
        byName(name) {
            return this.where({name: new RegExp(name, 'i')})
        },
        byAdmin(admin) {
            return this.where({ "admin.uid": admin })
        }
    }
})

export default Organization