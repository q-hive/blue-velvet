import { mongoose } from '../../mongo.js'
import Container from '../../models/container.js'
import Organization from '../../models/organization.js'
import {updateUser} from '../admin/store.js'
import { updateOrganization } from '../organization/store.js'
import { getAllOrders } from '../orders/store.js'
import { getMongoQueryByObject } from '../../utils/getMongoQuery.js'

const { ObjectId } = mongoose.Types
const orgModel = mongoose.model('organizations', Organization)

export const newContainer = (organization,contData) => {
    return new Promise((resolve, reject) => {

        let containerMapped = {
            name:           contData.name,
            admin:          contData.admin,
            organization:   contData.organization,
            capacity:       contData.capacity, // * Measured in trays
            employees:      contData.employees || [],
            production:     [],
            orders:         [],
            address:        contData.address,
            products:       [],
            location:       contData.location
        }

        let containerDoc = new contModel(containerMapped)

        containerDoc.save((e, cont) => {
            if (e) reject(e)

            Promise.all([
                updateOrganization(organization, {
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
     ?   sort
     */

    // let contModelFiltered = contModel 
    let containers = orgModel.findOne({"_id":filters.organization},{"containers":true})

    
    // // * Apply filters if requested
    // if (filters.organization !== undefined && filters.organization !== null) {
    //     contModelFiltered = contModelFiltered.where({ organization: filters.organization })
    // }

    // if (filters.admin !== undefined && filters.admin !== null) {
    //     contModelFiltered = contModelFiltered.where({ admin: filters.admin })
    // }

    return containers

}

export const getContainerById = (orgId, id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const orgWithContainer = await orgModel.findOne(
                {
                    "_id":ObjectId(orgId),
                    "containers._id":ObjectId(id)
                },
                "containers -_id"
            )
    
            resolve(orgWithContainer)
        } catch (err) {
            reject(err)
        }
        
    })

}

export const updateContainerById = (orgId,id, edit) => { 
    return new Promise(async (resolve, reject) => {

        try {
            const parsedEddit = {
                query: {
                    [getMongoQueryByObject(edit)]: {
                        [`containers.$.${edit.key}`]:edit.value
                    },
                }
                
            }
            
            const queryOp = await orgModel.updateOne(
                {
                    "_id":mongoose.Types.ObjectId(orgId),
                    "containers":{
                        "$elemMatch": {
                            "_id":mongoose.Types.ObjectId(id),
                        }
                    }
                },
                parsedEddit.query
            )

            console.log(queryOp)

            resolve(queryOp)
        } catch(err) {
            reject(err)
        }

    })
}

export const updateContainers = async (ids, edit) => {
    let cont = await contModel.updateMany({ _id: { $in: ids }}, edit, { multi: true, new: true })

    return cont
}

export const removeContainer = (orgId, containerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const op = await orgModel.findOneAndUpdate({"_id":mongoose.Types.ObjectId(orgId)}, {"$pull":{"containers._id":mongoose.Types.ObjectId(containerId)}})
            resolve(op)
        } catch (err) {
            reject(err)
        }
    })
}