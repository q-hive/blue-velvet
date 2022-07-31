import { mongoose } from '../mongo.js';
import Address from "./address.js"

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Client = new Schema({
    uid:                { type: String,   required: true, unique: true },
    email:              { type: String,     required: true             },
    passphrase:         { type: ObjectId, required: true, unique: true },
    organization:       { type: ObjectId, required: true, unique: true },
    name:               { type: String,   required: true,              },
    lname:              { type: String,   required: true,              },
    phone:              { type: String,     required: true             },
    image:              { type: String,   required: true               },
    businessName:       { type: String,   required: true, unique: true },
    socialInsurance:    { type: String,   required: true               },
    bankAccount:        { type: String,   required: true               },
    address:            { type: Address,  required: true               }
},
{
    query: {
        byName(name) {
            return this.where({ name: new RegExp(name, "i")})
        },
        byBusinessName(bName) {
            return this.where({ businessName: new RegExp(bName, "i")})
        },
        byOrganization(organization) {
            return this.where({ organization: organization })
        }
    }
})

export default Client