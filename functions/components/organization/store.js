import { mongoose } from '../../mongo.js'
import Organization from '../../models/organization.js'
import { deleteClient } from '../../components/client/store.js'
import { deletePassphrase } from '../passphrase/store.js'

const orgModel = mongoose.model('organization', Organization)

export const newOrganization = (orgData) => {
    return new Promise((resolve, reject) => {

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

export const getOrganizations = (filter) => {
    return new Promise((resolve, reject) => {  
        orgModel.find(filter).exec((err, docs) => {
            if (err) reject(err)
            
            resolve(docs)
        })
    })   
}

export const getOrganizationByOwner = (ownerId) => {
    return new Promise((resolve, reject) => {
        getOrganizations({"owner":mongoose.Types.ObjectId(ownerId)})
        .then((result) => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const getOrganizationById = (id, clean=false) => {
    return new Promise((resolve, reject) => {
        orgModel.find({"_id":mongoose.Types.ObjectId(id)})
        .then((result) => {
            resolve(result[0])
        })
        .catch((err) => {
            console.log(id)
            reject(err)
        })
        // if(clean) {
        //     orgModel.find({_id:id}, {lean:true}).exec((err, doc) => {
        //         if (err) reject(err)
    
        //         resolve(doc)
        //     })
        // }
        
        // orgModel.findById(mongoose.Types.ObjectId(id)).exec((err, doc) => {
        //     if (err) reject(err)

        //     resolve(doc)
        // })
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

export const deleteOrganization = (id) => {
    return new Promise((resolve, reject) => {
        orgModel.findByIdAndRemove(id, (err, org) => {
            if (err) reject(err);
            if (!org) {
                reject(new Error(JSON.stringify({message:"Organization not exists", status:409})))
            } else {
                const ownerId = org.owner.toString();
                deleteClient(ownerId)
                .then(client => {
                    deletePassphrase(ownerId)
                        .then(passphrase => {
                            resolve(org);
                        })
                        .catch(err => {
                            return error(req, res, 400, 'Error deleting the passphrase', err)
                        })
                })
                .catch(err => {
                    return error(req, res, 400, 'Error deleting the organization info', err)
                })
            }
        });        
    });
}
