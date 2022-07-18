import { mongoose } from '../../mongo.js'
import Organization from '../../models/organization.js'

const orgModel = new mongoose.model('organizations', Organization)

export const newOrganization = (orgData) => {
    return new Promise((resolve, reject) => {
        let orgModel = new mongoose.model('organizations', Organization)

        let orgMapped = {
            name: orgData.name,
            owner: orgData.owner,
            employees: [],
            containers: [],
            address: orgData.address
            
        }

        let orgDoc = orgModel(orgMapped)

        orgDoc.save((e, org) => {
            if (e) {
                reject(e)
            }
            resolve(org)
        })
    })
}

export const getOrganizations = (filters) => {
    
    // * Apply filters if requested
    if (filters.name != undefined && filters.name != null) {
        contModel = contModel.byName(filters.name)
    }

    if (filters.owner != undefined && filters.owner != null) {
        contModel = contModel.byOwner(filters.owner)
    }

    return orgModel.find({})
}

export const getOrganizationById = (id) => { 
    return orgModel.findById(id)
}

export const updateOrganization = (id, edit) => {
    return orgModel.update(id, edit)
}