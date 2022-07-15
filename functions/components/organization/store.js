import mongoose from '../../mongo.js'
import Organization from '../../models/organization.js'

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

        orgDoc.save((e, cont) => {
            if (e) {
                reject(e)
            }
            resolve(cont.id)
        })
    })
}