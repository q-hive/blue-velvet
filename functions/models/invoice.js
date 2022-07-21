import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

//**NETHERLANDS FOR BETA VERSION */
//*TODO UPDATE MODEL FROM TEMPLATE
const Invoice = Schema({
    customer:   ObjectId,
    order:      ObjectId,
    cost:       Number,
    status:     String
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