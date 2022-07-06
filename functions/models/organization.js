import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const organization = new Schema({ 
    _id: ObjectId,
    name: String,
    owner: ObjectId,
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
})

export default organization