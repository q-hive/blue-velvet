import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

//**NETHERLANDS FOR BETA VERSION */
//*TODO UPDATE MODEL FROM TEMPLATE
const Invoice = new Schema({
    client:     { type: ObjectId, required: true               },
    order:      { type: ObjectId, required: true, unique: true },
    cost:       { type: Number,   required: true               },
    status:     { type: String,   required: true               },

},
{
    timestamps: {
        "createdAt": "created",
        "updatedAt": "updated"
    },
    query: {
        byStatus(status) {
            return this.where({ status: status })
        },
        byClient(client) {
            return this.where({ client: client })
        },
        byOrder(order) {
            return this.where({ order: order })
        }
    }
})

export default Invoice