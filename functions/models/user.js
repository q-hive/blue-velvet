import { query } from 'express';
import mongoose from 'mongoose';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const User = new Schema({
    id:         ObjectId,
    email:      String,
    name:       String,
    lname:      String,
    role:       String,
    passphrase: String,
    salary:     Number, // * In case of EMPLOYEE
    containers: [ObjectId],
    customers:  [ObjectId], // * In case of ADMIN
    address: {
        stNumber:   String,
        street:     String,
        zip:        String,
        city:       String,
        state:      String,
        country:    String,
        references: String
    },
},
{
    query: {
        byRole(role) {
            return this.where({ role: role })
        },
        byContainer(contId) {
            return this.where({ container: { $in: contId } })
        },
        byOrganization(orgId) {
            return this.where({ organization: { $in: orgId }})
        },
        byName(name) {
            return this.where({ name: new RegExp(name, "i")})
        },
        byLname(lname) {
            return this.where({ lname: new RegExp(lname, "i")})
        }
    }
})

export default User