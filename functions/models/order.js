import mongoose from 'mongoose'
import Address from './address.js';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Order = new Schema({
    organization:   { type: ObjectId,   required: true },
    customer:       { type: ObjectId,   required: true },
    cyclic:         { type: Boolean,    required: true }, // REPETEAD ORDERS HAVE A START AND END DATE
    job:            { type: String,     default:"No job"},
    price:          { type: Number,     required: true },
    date:           { type: Date,       required: true },
    next:           { type: ObjectId,   required: true },
    // end:            { type: Date,       required: true },
    products:   {
        type: [{
            _id:        { type: ObjectId, required: true  },
            name:       { type: String, required: true  },
            packages:   { type: [
                {
                    size:   String,
                    number: Number,
                    grams:  Number
                }
            ],   required: true  },
            status:     { type: String,   required: true  },
            seedId:     { type: String,   required: false },
            mix:        { isMix: {type: Boolean,  required: false}  },
            price:      { type:  [],      required: true  }
        }],
        required: true
    },
    address:            { type: Address,  required: true  },
    // productionData: {type: [
    //     {
    //         product:    String,
    //         seeds:      Number,
    //         harvest:    Number,
    //         trays:      Number
    //     }
    // ], required: true
    // },
    status:         { type:String,      required:true   }
},
{
    timestamps:{
        createdAt:"created",
        updatedAt:false
    },
    query: {
        byType(type) {
            return this.where({ type: type })
        },
        byAdmin(admin) {
            return this.where({ admin: admin })
        },
        byClient(client) {
            return this.where({ client: client })
        }
    }
})

//STATUS
//* pending
//* stopped
//* Seeding
//* GROWING -- 2 days p/w 7am
//* harvestingPacking
//* ready
//* delivered

export default Order