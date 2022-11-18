import { mongoose } from '../mongo.js'

import { addTimeToDate } from '../utils/time.js';
import { generateTasks } from '../components/tasks/store.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

import GlobalWorkDay from './GlobalWorkDay.js';

const Production = new Schema({
    ProductName:         String,
    ProductID:           ObjectId,
    ProductionStatus:    String,
    RelatedOrder:     ObjectId,
    EstimatedHarvestDate: Date,
    seeds:               Number,
    harvest:             Number,
    trays:               Number,
    ContainerId:         ObjectId
},
{
    timestamps: {
        createdAt: "start",
        updatedAt: "updated"
    },
})

export default Production