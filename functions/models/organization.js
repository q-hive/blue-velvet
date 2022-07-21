import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Organization = new Schema({ 
    name: String,
    admin: ObjectId,
    employees: [ObjectId],
    containers: [ObjectId],
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
        byName(name) {
            return this.where({name: new RegExp(name, 'i')})
        },
        byAdmin(admin) {
            return this.where({ admin: admin })
        }
    }
})

export default Organization