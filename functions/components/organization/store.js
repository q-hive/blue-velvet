import { mongoose } from '../../mongo.js'
import Organization from '../../models/organization.js'

const orgModel = new mongoose.model('organizations', Organization)

export const newOrganization = (orgData) => {
    return new Promise((resolve, reject) => {
        let orgModel = new mongoose.model('organizations', Organization)

        // * Fill the 'available' field on the data
        let contMapped = orgData.containers.map(container => {
            return {...container, available: container.capacity}
        })

        let orgMapped = {
            name:       orgData.name,
            owner:      orgData.owner,
            employees:  [],
            orders:     [],
            containers: contMapped,
            customers:  orgData.customers || [],
            providers:  [], 
            address:    orgData.address,
        }

        let orgDoc = orgModel(orgMapped)

        orgDoc.save((err, org) => {
            if (err) reject(err)

            resolve(org)
        })
    })
}

export const getOrganizations = () => {
    return new Promise((resolve, reject) => {  
        orgModel.find({}).exec((err, docs) => {
            if (err) reject(err)

            resolve(docs)
        })
    })   
}

export const getOrganizationById = (id) => {
    return new Promise((resolve, reject) => {
        orgModel.findById(id).exec((err, doc) => {
            if (err) reject(err)

            resolve(doc)
        })
    }) 
}

export const updateOrganization = (id, edit) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate({ _id: id }, edit, { new: true }).exec((err, doc) => {
            if (err) reject(err)
            
            resolve(doc)
        })
    })
}