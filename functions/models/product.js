import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Product = new Schema({
    name:       { type: String,   required: true  },
    image:      { type: String,   required: false }, // * BASE 64 PARSED PHOTO
    desc:       { type: String,   required: false }, // * Description
    status:     { type: String,   required: true  },
    // * ID of quality of the seeds - track the seeds origin - metadata 
    seed:       { type: ObjectId, required: true  }, 
    provider:   { type: ObjectId, required: true  },
    price:      { // * Cost per package 
        type: [{
            amount:         { type: Number, required: true }, // * Package price
            packageSize:    { type: Number, required: true }  // * PACKAGE SIZE IN GRAMS
        }], 
        required: true  
    }, 
    mix: {
        type: {
            isMix:  { type: Boolean, required: true },
            products: {
                type: [{
                    strain: { type: ObjectId, required: true },
                    amount: { type: Number,   required: true }, // * Measured in trays
                }],
                required: false 
            }
        },
        required: false
    },
    parameters: {
        type: {
            day:            { type: Number, required: true }, // * In days check email
            night:          { type: Number, required: true }, // * In days check email
            seedingRate:    { type: Number, required: true }, // * Per tray
            harvestRate:    { type: Number, required: true }  // * Per tray
        },
        required:   true
    }
},
{
    timestamps: {
        "createdAt": "created",
        "updatedAt": "updated"
    },
    query: {
        byName(name) {
            return this.where({ name: new RegExp(name, 'i') })
        },
        byDesc(desc) {
            return this.where({ desc: new RegExp(desc, 'i') })
        },
        byStatus(status) {
            return this.where({ status: status })
        }
    }
})

export default Product