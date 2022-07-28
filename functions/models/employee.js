import mongoose from 'mongoose';
import Address from './address.js'

const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const Employee = new Schema({
    uid:            { type: String,     required: true  },
    email:          { type: String,     required: true  },
    name:           { type: String,     required: true  },
    lname:          { type: String,     required: false }, 
    phone:          { type: String,     required: true  },
    image:          { type: String,     required: true  },
    containers:     { type: [ObjectId], required: true  },
    salary:         { type: Number,     required: true  },   
    address:        { type: Address,    required: true  },
},
{
    query: {
        byContainer(contId) {
            return this.where({ container: { $in: contId } })
        },
        byName(name) {
            return this.where({ name: new RegExp(name, "i")})
        },
        byLname(lname) {
            return this.where({ lname: new RegExp(lname, "i") })
        },
        byEmail(email) {
            return this.where({ email: new RegExp(email, "i") })
        }
    }
})

export default Employee