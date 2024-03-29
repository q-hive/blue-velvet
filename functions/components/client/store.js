import { mongoose } from '../../mongo.js'
const { ObjectId } = mongoose.Types
const { Schema } = mongoose

import Client from '../../models/client.js' 
import { organizationModel } from '../../models/organization.js'
import adminAuth from '../../firebaseAdmin.js'

const clientModel = mongoose.model('clients', Client)

export const updateClient = (req, res) => {
    return new Promise((resolve, reject) => {
        console.log("Updating customer with ID: " + req.params.id)
        req.body._id = req.params.id
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

export const deleteClient = (id) => {
    return new Promise((resolve, reject) => {
        clientModel.findByIdAndRemove(id, (err, doc) => {
            if (err) reject(err);
            if (!doc) {
                reject(new Error(JSON.stringify({message:"Client not exists", status:409})))
            } else {
                adminAuth.deleteUser(doc.uid)
                resolve(doc);
            }
        });        
    });
}
