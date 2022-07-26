import mongoose from '../mongo.js';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const User = new Schema({
    uid:            { type: String,     required: true  },
    email:          { type: String,     required: true  },
    name:           { type: String,     required: true  },
    lname:          { type: String,     required: false },
    role:           { type: String,     required: true  }, 
    phone:          { type: String,     required: true  },
    image:          { type: String,     required: true  },
    organization:   { type: ObjectId,   required: true  },
    passphrase:     { type: ObjectId,   required: false }, // * role: ADMIN
    containers:     { type: [ObjectId], required: true  },
    salary:         { type: Number,     required: false }, // * role: EMPLOYEE   
    address: {
        type: {
            stNumber:   String,
            street:     String,
            zip:        String,
            city:       String,
            state:      String,
            country:    String,
            references: String
        },
        required: true
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