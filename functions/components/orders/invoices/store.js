import { mongoose } from "../../../mongo.js";

import { organizationModel } from "../../../models/organization.js";



export const getOrganizationInvoices = (req, res) => {
    return new Promise((resolve,reject) => {
        mongoose.connection.collection('invoices').find(
            {
                "issuerOrganization":res.locals.organization,
                "customer":mongoose.Types.ObjectId(req.params.customer_id)
            }
        )
        .project({"issuerOrganization":false})
        .toArray()
        .then((array) => {
            resolve(array)
        })
        .catch(err => {
            reject(err)
        })
    })
}

//*UPDATRES INVOICES COLLECTION
export const updateOrganizationInvoiceByCustomer = (req, res) => {
    return new Promise((resolve, reject) => {
        const {payed} = req.query

        if(payed === "true" || payed === "false"){
            mongoose.connection.collection('invoices').updateMany(
                {
                    "customer":mongoose.Types.ObjectId(req.params.customer_id), 
                    "issuerOrganization":res.locals.organization
                },
                {
                    "$set":{
                        "payed":Boolean(payed)
                    }
                }
            )
            .then(result => resolve(result))
            .catch(err => reject(err))
            return
        } 

        reject(new Error("The value provided to the query is not valid"))
        
    })
}

//*UPDATES INVOICES KEY OF ORGANIZATIONS COLLECTION DOCS
export const updateOrganizationInvoice = (orgId,updateDoc, filters) => {
    return new Promise((resolve, reject) => {
        organizationModel.updateOne(
            {
                "_id":mongoose.Types.ObjectId(orgId),
            },
            updateDoc,
            filters
            
        )
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
}

export const updateInvoice = (filter, updateDoc) => {
    return new Promise((resolve, reject) => {
        mongoose.connection.collection('invoices').updateOne(filter, updateDoc)
        .then((result) => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}