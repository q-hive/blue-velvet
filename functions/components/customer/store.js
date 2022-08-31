import mongoose from 'mongoose';
import Organization from '../../models/organization.js';

const orgModel = mongoose.model('organizations', Organization)

export const createNewCustomer = (orgId, data) => {
    return new Promise((resolve, reject) => {
        orgModel.findById(orgId).exec()
        .then(async orgDoc => {
            const foundCustomer = orgDoc.customers.find(customer => customer.name === data.name)
            
            if(foundCustomer){
                return reject(new Error(JSON.stringify({message:"Customer already exists", status:409})))
            }

            console.log(data)
            let customerMapped = {
                name:   data.name,
                email:  data.email,
                image:  "",
                address: data.address, 
            } 
            
            orgDoc.customers.push(customerMapped)
            orgDoc.save()
            .then(doc => {
                console.log("Customer saved succesfully")
                return resolve(doc)
            })
            .catch(err => {
                return reject(err)
            })
        })
        .catch(err => {
            reject(err)
        })
    })
    
}

export const getAllCustomers = (orgId) => {
    return new Promise((resolve, reject) => {
        const emptyDbError = {
            status: 204,
            message:"Customers DB is empty"
        }

        const errorFindingOrg = {
            status: 500,
            message:"An error ocurred while finding organization",
        }
        
        orgModel.findById(orgId).exec()
        .then(orgDoc => {
            if(orgDoc.customers.length > 0){
                return resolve(orgDoc.customers)
            }

            return reject(new Error(JSON.stringify(emptyDbError)))
        })
        .catch(err => {
            console.log(err)
            reject(new Error(JSON.stringify(errorFindingOrg)), err)
        })
    })
}