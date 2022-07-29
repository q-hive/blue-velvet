import { mongoose } from '../../mongo.js'
import { ObjectId } from mongoose.Types

import { Client } from '../../models/client.js' 

const clientModel = mongoose.Schema('clients', Client)

export const updateClient = (id, edit) {
    return new Promise((resolve, reject) => {

    })
}