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
        }
    }
})

export default Invoice