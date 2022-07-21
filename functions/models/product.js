import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Product = new Schema({
    name:           String,
    image:  {
        type:       String,
        required:   false
    }, //*BASE 64 PARSED PHOTO
    desc:   {
        type:       String,
        required:   false
    }, //* Description
    cost:   Number, // * Cost per tray,
    seedId: {
        type:String,
        required:false
    }, // * ID of quality of the seeds - track the seeds origin - metadata,
    mix: {
        type: {
            isMix:Boolean,
            name:String,
            products:[ObjectId]
        },
        required:false
    },
    parameters: {
        type: {
            day:            Number, // * In days check email
            night:          Number, // * In days check email
            seedingRate:    Number,  
        },
        required:false
    }
},
{
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