import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const product = new Schema({
    _id:    ObjectId,
    name:   String,
    image:  String,
    desc:   String,
    cost:   Number, // * Cost per tray,
    seedId: String, //* ID of quality of the seeds - track the seeds origin - metadata,
    status: String, //* Under production, ordered, stopped
    mix:{
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

export default product