import mongoose from 'mongoose';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const user = new Schema({
    id:         ObjectId,
    email:      String,
    name:       String,
    lname:      String,
    role:       String,
    passphrase: String,
    salary:     Number, // * In case of EMPLOYEE
    container:  [ObjectId],
    customer:   [ObjectId], // * In case of ADMIN
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

export default user