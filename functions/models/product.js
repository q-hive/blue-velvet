import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Product = new Schema({
    name:       { type: String, required: true  },
    image:      { type: String, required: false }, // * BASE 64 PARSED PHOTO
    desc:       { type: String, required: true  }, // * Description
    price:      { type: Number, required: true  }, // * Cost per tray
    // * ID of quality of the seeds - track the seeds origin - metadata 
    // ? This seedId must be per order because many same proudcts can come from distinct providers because of users using their providers
    // ? Should we consider an entity for providers
    seedId:     { type: String, required: false }, 
    status:     { type: String, required: true  }, // ? Que significa este status en esta tabla???
    provider:   { type: String, required: false }, // ? Check if is needed the provider and if any more info is needed
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
        required:   false
    },
    parameters: {
        type: { // ? Ask for validation of how parameters should be stored
            day:            { type: Number, required: true }, // * In days check email
            night:          { type: Number, required: true }, // * In days check email
            seedingRate:    { type: Number, required: true },
            harvestRate:    { type: Number, required: true }  
        },
        required:false
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
        }
    }
})

export default Product