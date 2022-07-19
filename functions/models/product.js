import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Product = new Schema({
    name:   String,
    image:  String,
    desc:   String,
    cost:   Number, // * Cost per tray,
    seedId: String, // * ID of quality of the seeds - track the seeds origin - metadata,
    mix: {
        isMix:Boolean,
        name:String,
        products:[ObjectId]
    },
    parameters: {
        day:            Number, // * In days check email
        night:          Number, // * In days check email
        seedingRate:    Number,  
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