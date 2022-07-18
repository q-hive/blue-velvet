import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const customer = new Schema({
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
},
{
    query: {
        byName(name) {
            return this.where({ name: new RegExp(name, "i")})
        },
        byBusinessName(bName) {
            return this.where({ businessName: new RegExp(bName, "i")})
        }
    }
})

export default customer