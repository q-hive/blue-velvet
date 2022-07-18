import { mongoose } from '../../mongo.js'
import Container from '../../models/container.js'

const { ObjectId } = mongoose.Types

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

        let containerDoc = containerModel(containerMapped)

        containerDoc.save((e, cont) => {
            if (e) {
                reject(e)
            }
            resolve(cont.id)
        })
    })    
}

export const getContainers = (filters) => {

    /*
    * Get all containers for the given filters if present
    ?   organization
    ?   admin
    */

    let contModel = mongoose.model('containers', Container)

    // * Apply filters if requested
    if (filters.organization != undefined && filters.organization != null) {
        contModel = contModel.byOrganization(filters.organization)
    }

    if (filters.admin != undefined && filters.admin != null) {
        contModel = contModel.byAdmin(filters.admin)
    }

    return contModel.find({}).exec()

}

export const getContainerById = (id) => {
    let contModel = mongoose.model('containers', Container)

    return contModel.findById(ObjectId(id))
}