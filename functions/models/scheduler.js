import mongoose from 'mongoose'
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

const SchedulerSchema = new Schema({
    OrganizationId:         { type: ObjectId, required: true },
    OrderId:                { type: ObjectId, required: true },
    ProductId:              { type: ObjectId, required: true },
    creationDate:           { type: Date,     required: true },
    deliveryDate:           { type: Date,     required: true },
    startProductionDate:    { type: Date,     required: true },
})

const Scheduler = mongoose.model('Scheduler', SchedulerSchema);

export default Scheduler
