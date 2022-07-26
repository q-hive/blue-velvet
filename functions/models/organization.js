import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Organization = new Schema({ 
    name:       { type: String,     required: true, unique: true },
    admin:      { type: ObjectId,   required: true },
    employees:  { type: [ObjectId], required: true },
    containers: { type: [ObjectId], required: true, unique: true }, 
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
        required: false // ? Dont know if address is required
    }
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