import mongoose from 'mongoose'
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const Order = new Schema({
    client:     { type: ObjectId,   required: true },
    customer:   { type: ObjectId,   required: true },
    type:       { type: String,     required: true }, // REPETEAD ORDERS HAVE A START AND END DATE
    packages:   { type: Number,     required: true },
    price:      { type: Number,     required: true },
    end:        { type: Date,       required: true },
    production: { type: [ObjectId], required: true },
    products:   {
        type: [{
            _id:    { type: ObjectId, required: true  },
            status: { type: String,   required: true  },
            trays:  { type: Number,   required: true  },
            seedId: { type: String,   required: false },
            batch:  { type: String,   required: false }
        }],
        required: true
    },
},
{
    timestamps: {
        createdAt: "start",
        updatedAt: "updated"
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

export default Order