import mongoose from 'mongoose';
import Organization from '../../models/organization.js';

const orgModel = mongoose.model('organizations', Organization)

export const createNewCustomer = (orgId, data) => {
    return new Promise((resolve, reject) => {
        orgModel.findById(orgId).exec()
        .then(async orgDoc => {
            console.log(orgDoc)
            const customerExists = await orgDoc.customers.find({name:data.name}).exec()
            console.log(customerExists)
            if(customerExists){
                console.log("Customer already exists")
                resolve(orgDoc)
                return
            }
            
        })
        .catch(err => {
            reject(err)
        })
    })
    
}