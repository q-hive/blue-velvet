import mongoose from '../mongo.js';


const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Client = new Schema({
    name:               { type: String,   required: true, unique: true },
    businessName:       { type: String,   required: true, unique: true },
    image:              { type: String,   required: true               },
    socialInsurance:    { type: String,   required: true               },
    organization:       { type: ObjectId, required: true, unique: true },
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