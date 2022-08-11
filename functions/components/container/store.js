import { mongoose } from '../../mongo.js'
import Organization from '../../models/organization.js'
import { updateUser} from '../admin/store.js'
import { getOrganizationById, updateOrganization } from '../organization/store.js'

const { ObjectId } = mongoose.Types
const orgModel = mongoose.model('organizations', Organization)

export const newContainer = (orgId, contData) => {
    return new Promise((resolve, reject) => {

        getOrganizationById(orgId)
        .then(org => {

            let contId = new ObjectId()

            let containerMapped = {
                _id:            contId,
                name:           contData.name,
                capacity:       contData.capacity, // * Measured in trays
                available:      contData.capacity,
                employees:      contData.employees || [],
                production:     [],
                products:       [],
                address:        contData.address
            }

            org.containers.push(containerMapped)
    
            org.save((err, doc) => {
                if (err) reject(err)
                resolve(doc)
            })
        })

    })    
}

export const getContainers = (orgId, filters) => {

    /*
     * Get all containers for the given filters if present
     ?   name
     ?   capacity
     ?   available
     ?   sort
     */
    return new Promise((resolve, reject) => {

        getOrganizationById(orgId)
        .then(org => {
            let contFiltered = org.containers
            
            // * Apply filters if requested
            if (filters.name !== undefined && filters.name !== null) {
                contFiltered = contFiltered.where({ name: filters.name })
            }
            if (filters.capacity !== undefined && filters.capacity !== null) {
                contFiltered = contFiltered.where({ capacity: filters.capacity })
            }
            if (filters.available !== undefined && filters.available !== null) {
                contFiltered = contFiltered.where({ available: filters.available })
            }
        
        
            return contFiltered.find().exec()
        })

    })
}

export const getContainerById = (orgId, contId) => {
    return new Promise((resolve, reject) => {

        getOrganizationById(orgId)
        .then(org => { 
            org.containers.findOneById(contId).exec((err, doc => {
                if (err) reject(err)
                resolve(doc)
            }))
        })

    })
}

export const updateContainer = async (orgId, contId, edit) => { 
    // * Should be used ONLY to edit metadata of the container
    getOrganizationById(orgId)
    .then(org => {
        org.containers.findByIdAndUpdate(contId, edit, { new: true })
        .exec((err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })
}

export const updateContainers = async (ids, edit) => {

    return new Promise((resolve, reject) => {
        getOrganizationById(orgId =>)
        let cont = await contModel.update({ _id: { $in: ids }}, edit, { multi: true, new: true })
        return cont
    })

}