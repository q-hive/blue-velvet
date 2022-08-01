import { mongoose } from '../../mongo.js'
const { ObjectId } = mongoose.Types
const { Schema } = mongoose

import Client from '../../models/client.js' 

const clientModel = mongoose.model('clients', Client)

export const updateClient = (id, edit) => {
    return new Promise((resolve, reject) => {

    })
}

export const newClient = (data) => {
    return new Promise((resolve, reject) => {
        let clientDoc = new clientModel(data)

        clientDoc.save((err, doc) => {
            if (err) reject(err)

            resolve(doc)
        })
    })
}