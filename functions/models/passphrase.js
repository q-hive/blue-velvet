import mongoose from 'mongoose';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const Passphrase = new Schema({
    client:         { type: ObjectId, required: true, unique: true },
    uid:            { type: String,   required: true, unique: true },
    passphrase:     { type: String,   required: true               },
    organization:   { type: ObjectId, required: false               }
    // FIXME: Validacion cuando sea superadmin, no sea requerido 
},
{
    timestamps: {
        createdAt: "created",
        updatedAt: "updated"
    },
    query: {
        byOrganization(organization) {
            return this.where({ organization: organization })
        },
        byUid(uid) {
            return this.where({ uid: uid })
        },
        byPassphrase(passphrase) {
            return this.where({ passphrase: passphrase })
        }
    }
})

export default Passphrase