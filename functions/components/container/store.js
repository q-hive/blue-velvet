import { mongoose } from '../../mongo.js'
import Container from '../../models/container.js'
import Organization from '../../models/organization.js'
import {updateUser} from '../admin/store.js'
import { updateOrganization } from '../organization/store.js'
import { getAllOrders } from '../orders/store.js'

const { ObjectId } = mongoose.Types
const orgModel = mongoose.model('organizations', Organization)

export const newContainer = (contData) => {
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
     ?   sort
     */

    let contModelFiltered = contModel 

    // * Apply filters if requested
    if (filters.organization !== undefined && filters.organization !== null) {
        contModelFiltered = contModelFiltered.where({ organization: filters.organization })
    }

    if (filters.admin !== undefined && filters.admin !== null) {
        contModelFiltered = contModelFiltered.where({ admin: filters.admin })
    }

    return contModelFiltered.find({})

}

export const getContainerById = (id, orgId) => {
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

export const updateContainer = (orgId,id, edit) => { 
    return new Promise(async (resolve, reject) => {
        const stringForNestedDoc = edit

                
        //*In order to update multiple containers, is necesary to check if the element share ordere
        //*This is because orders define behavior on producction and tasks
        const organization =  await orgModel.findOne({_id:orgId})
        
        const orders = organization.orders 
        
        const mappedOrders = organization.orders.map(async (order, idx) => {
            const orders =  await getAllOrders(orgId, id, {key:"orders._id", value:order._id})
            orgModel.updateOne({"$elemMatch":{_id:orgId, "orders":{"$elementMatch":{}}}})
        })

        Promise.all(mappedOrders)

        
        resolve("Container updated")
        
        // //*TODO: Change to one query because is updateContainer not updateProductInContainer
        // let org = await orgModel.updateOne({_id:orgId}, {"$set": {
            
        // }})

        
        // org.containers[0][Object.keys(edit)[0]].push(edit[Object.keys(edit)[0]])
        // await org.save()
        // return org
        
    })
}

export const updateContainers = async (ids, edit) => {
    let cont = await contModel.updateMany({ _id: { $in: ids }}, edit, { multi: true, new: true })

    return cont
}