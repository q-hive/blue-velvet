import { mongoose } from '../mongo.js'

import { addTimeToDate } from '../utils/time.js';
import { generateTasks } from '../components/tasks/store.js'

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types

import GlobalWorkDay from './GlobalWorkDay.js';

const Production = new Schema({
    ProductName:            String,
    RelatedMix:             {isForMix: Boolean, mixName:String},
    ProductID:              ObjectId,
    ProductionStatus:       String,
    RelatedOrder:           ObjectId,
    EstimatedStartDate:     Date,
    EstimatedHarvestDate:   Date,
    seeds:                  Number,
    harvest:                Number,
    trays:                  Number,
    dryracks:               Number,
    ContainerId:            ObjectId,
    
})

export default Production