import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

//**NETHERLANDS FOR BETA VERSION */
//*TODO UPDATE MODEL FROM TEMPLATE
const Invoice = Schema({
    customer:   { type: ObjectId, required: true },
    order:      { type: ObjectId, required: true, unique: true },
    cost:       { type: Number,   required: true },
    status:     { type: String,   required: true },

},
{
    query: {
        byStatus(status) {
            return this.where({ status: status })
        },
        byCustomer(customer) {
            return this.where({ customer: customer })
        },
        byOrder(order) {
            return this.where({ order: order })
        }
    }
})

export default Invoice