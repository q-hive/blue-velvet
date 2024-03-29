import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Product = new Schema({
    name:       { type: String,   required: true,                    },
    image:      { type: String,   required: false                    }, // * BASE 64 PARSED PHOTO
    desc:       { type: String,   required: false                    }, // * Description
    status:     { type: String,   required: true, default: 'stopped' },
    // * ID of quality of the seeds - track the seeds origin - metadata 
    seed:       { type: {}, required: false                    }, 
    provider:   { type: {}, required: false                    },
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
        required: true
    },
    parameters: {
        type: {
            day:            { type: Number, required: true }, // * In days check email
            night:          { type: Number, required: true }, // * In days check email
            seedingRate:    { type: Number, required: true }, // * Per tray
            harvestRate:    { type: Number, required: true }, // * Per tray
            overhead:       { type: Number, required: true, default: 0}
        },
        required:   false
    },
    performance:Number
},
{
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