import { mongoose } from '../mongo.js';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const SuperAdmin = new Schema({
    uid:        { type: String,   required: true, unique: true },
    email:      { type: String,   required: true, unique: true },
    passphrase: { type: ObjectId, required: true, unique: true },
    name:       { type: String,   required: true,              },
    lname:      { type: String,   required: true,              },
    phone:      { type: String,   required: true               },
    image:      { type: String,   required: true               },
},
{
    query: {
        byName(name) {
            return this.where({ name: new RegExp(name, "i")})
        }
    }
})

export default SuperAdmin