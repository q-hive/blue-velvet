import mongoose from 'mongoose';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const User = new Schema({
    uid:            String,
    email:          String,
    name:           String,
    lname:          String,
    role:           String, 
    phone:          String,
    image:          String,
    organization:   ObjectId,
    containers:     [ObjectId],
    passphrase:     { // * In case of ADMIN
        type:       String,
        required:   false
    },     
    customers:      { // * In case of ADMIN
        type:       [ObjectId],
        required:   false
    },
    salary:         {  // * In case of EMPLOYEE in money per Hours of work
        type:       Number,
        required:   false
    },   
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