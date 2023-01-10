import { mongoose } from '../../mongo.js'
const { ObjectId } = mongoose.Types
const { Schema } = mongoose

import Client from '../../models/client.js' 
import { organizationModel } from '../../models/organization.js'

const clientModel = mongoose.model('clients', Client)

export const updateClient = (req, res) => {
    return new Promise((resolve, reject) => {
        console.log(req.body)
        console.log(req.params.id)
        organizationModel.updateOne(
            {
                "_id":mongoose.Types.ObjectId(res.locals.organization),
            },
            {
                "$set":{
                    "customers.$[customer]":req.body
                }
            },
            {
                "arrayFilters":[
                    { "customer._id":mongoose.Types.ObjectId(req.params.id) }
                ]
            }
        )
        .then(result => resolve(result))
        .catch(err => reject(err))
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