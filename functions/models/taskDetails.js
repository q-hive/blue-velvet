import mongoose from 'mongoose';
const { Schema  } = mongoose;
const { ObjectId } = mongoose.Types

const TaskDetails = new Schema({
    title:          { type: String,   required: true  },
    type:           { type: String,   required: true  },
    // description:    { type: String,   required: true  },
    // steps:          { type: [
    //     {
    //         title:          String,
    //         description:    String,
    //         specific:       {
    //             type: {
    //                 isUnique:   Boolean,
    //                 type:       String
    //             }, required:    false
    //         }
    //     }
    // ], required: true  },   
    // tools:          { type: [String], required: true  },
})

export default TaskDetails