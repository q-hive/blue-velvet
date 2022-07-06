import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const customer = new Schema({
    _id:                ObjectId,
    name:               String,
    businessName:       String,
    image:              String,
    socialInsurance:    String,
    bankAccount:        String,
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

export default customer