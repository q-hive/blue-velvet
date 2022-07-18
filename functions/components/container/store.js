import { mongoose } from '../../mongo.js'
import Container from '../../models/container.js'
import { updateOrganization } from '../organization/store.js'
import { updateUser } from '../admin/store.js'

const { ObjectId } = mongoose.Types
const contModel = mongoose.model('containers', Container)

export const newContainer = (contData) => {
    return new Promise((resolve, reject) => {
        let containerModel = new mongoose.model('containers', Container)

        let containerMapped = {
            name:           contData.name,
            admin:          contData.admin,
            organization:   contData.organization,
            capacity:       contData.capacity, // * Measured in trays
            employees:      contData.employees || [],
            prodLines:      [],
            address:        contData.address,
            products:       [],
            location:       contData.location
        }

        let containerDoc = new containerModel(containerMapped)

        containerDoc.save((e, cont) => {
            if (e) reject(e)

            // * Update organization field
            updateOrganization(contData.organization, {
                $púsh: { containers: cont._id } 
            })

            // * Update user field
            updateUser(contData.admin, {
                $púsh: { containers: cont._id }
            })
            
            resolve(cont)
        })
    })    
}

export const getContainers = (filters) => {

    /*
     * Get all containers for the given filters if present
     ?   organization
     ?   admin
     */

    let contModelFiltered = contModel 

    // * Apply filters if requested
    if (filters.organization != undefined && filters.organization != null) {
        contModelFiltered = contModelFiltered.where({ organization: filters.organization })
    }

    if (filters.admin != undefined && filters.admin != null) {
        contModelFiltered = contModelFiltered.where({ admin: filters.admin })
    }

    return contModelFiltered.find({})

}

export const getContainerById = (id) => {
    return contModel.findById(ObjectId(id))
}

export const updateContainer = (id, edit) => { 
    return contModel.update(id, edit)
}

export const updateContainers = (ids, edit) => {
    return contModel.updateMany({ _id: { $in: ids }}, edit, { multi: true })
}