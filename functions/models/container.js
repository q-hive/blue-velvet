import mongoose from '../../mongo.js';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Container = new Schema({
    name:           String,
    admin:          ObjectId,
    organization:   ObjectId,
    capacity:       Number, // * Measured in trays
    available:      Number, // * Also in trays
    employees:      [ObjectId],
    production:     [ObjectId],
    orders:         [ObjectId],
    address: {
        stNumber:   String,
        street:     String,
        zip:        String,
        city:       String,
        state:      String,
        country:    String,
        references: String
    },
    products: [{
        _id:    ObjectId,
        trays:  Number
    }],
    location: {
        latitude:   Number,
        longitude:  Number
    },
},
{
    query: {
        byName(name) {
            return this.where({ name: new RegExp(name, "i") })
        },
        byAdmin(admin) {
            return this.where({ admin: admin })
        },
        byOrganization(orgId) {
            return this.where({ organization: orgId })
        }
    }
})

export default Container