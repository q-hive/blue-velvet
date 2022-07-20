import { mongoose } from '../../mongo.js'
import Container from '../../models/container.js'
import { updateOrganization } from '../organization/store.js'
import { updateUser } from '../admin/store.js'

const { ObjectId } = mongoose.Types
const contModel = mongoose.model('containers', Container)

export const newContainer = (contData) => {
    return new Promise((resolve, reject) => {

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

        let containerDoc = new contModel(containerMapped)

        containerDoc.save((e, cont) => {
            if (e) reject(e)

            Promise.all([
                updateOrganization(contData.organization, {
                    $push: { containers: cont._id } 
                }),
                updateUser(contData.admin, {
                    $push: { containers: cont._id }
                })
            ]).then(() => resolve(cont))
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

export const updateContainer = async (id, edit) => { 
    let cont = await contModel.findOneAndUpdate({ _id: id }, edit, { new: true })
    return cont
}

export const updateContainers = async (ids, edit) => {
    let cont = await contModel.updateMany({ _id: { $in: ids }}, edit, { multi: true, new: true })
    return cont
}