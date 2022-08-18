import mongoose from 'mongoose'

const { Schema } = mongoose
const { ObjectId } = mongoose.Types

const Seed = new Schema({
    seedId:     { type: String,   required: true  }, // * User fed
    seedName:   { type: String,   required: true  }, // * Name provided by provider xd
    product:    { type: ObjectId, required: true  },
    batch:      { type: String,   required: false },
    provider:   { type: ObjectId, required: true  }
},
{
    timestamps: {
        "createdAt": "created",
        "updatedAt": "updated"
    }
})

export default Seed