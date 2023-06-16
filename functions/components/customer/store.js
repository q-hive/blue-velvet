import mongoose from 'mongoose';
import Organization from '../../models/organization.js';
import { getMongoQueryByObject } from '../../utils/getMongoQuery.js';
import { actualMonthInitialDate } from '../../utils/time.js';

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
                role:   data.role,
                image:  "",
                address: data.address,
                businessData: data.businessData
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
            const getMonthlySalesByCustomer = (organization, customerId) => {
                return new Promise(async (resolve, reject) => {
                    const models = await orgModel.aggregate(
                        [
                            {
                                "$match": {
                                    "_id":mongoose.Types.ObjectId(orgId)
                                }
                            },
                            {
                                "$project":{
                                    "orders":{
                                        "$filter":{
                                          "input":"$orders",
                                          "as":"order",
                                          "cond":{
                                            "$and":[
                                              { "$gte":["$$order.created",new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(),1)] },
                                              { "$lt":["$$order.created",new Date(new Date().getUTCFullYear(),new Date().getUTCMonth()+1,1)] },
                                              { "$eq": ["$$order.customer", mongoose.Types.ObjectId(customerId)] }
                                            ]
                                          }
                                        }
                                    }
                                }
                            },
                            {
                                "$addFields":{
                                    "totalMonth":{"$sum":"$orders.price"}
                                }
                            }
                        ]    
                    )

                    console.log(models)
                    if(models.length>0){
                        resolve(models[0].totalMonth)
                        return
                    }

                    resolve(0)
                    
                })
            }
            if(orgDoc.customers.length > 0){
                const mappedCustomers = orgDoc.customers.map(async customer => {
                    const allOrders = orgDoc.orders.filter((order) => (order.customer.equals(customer._id) && order.status !== "delivered"))
                    const monthlySales = await getMonthlySalesByCustomer(orgId, customer._id)
                    
                    let totalSales = 0
                    if(allOrders.length>0){
                        totalSales = allOrders.reduce((prev, current) => {
                            return prev + current.price
                        }, 0)
                    }
                    const mutableCustomer = customer.toObject()
                    return {...mutableCustomer, orders:allOrders, sales:totalSales, monthlySales: monthlySales}
                })
                
                Promise.all(mappedCustomers)
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                })

                return
            }

            return resolve(orgDoc.customers)
        })
        .catch(err => {
            console.log(err)
            reject(new Error(JSON.stringify(errorFindingOrg)), err)
        })
    })
}

export const getCustomerById = (orgId, customerId) => {
    return new Promise(async (resolve, reject) => {
        const organization = await orgModel.findById(orgId).exec()

        if(!organization){
            const emptyOrg = {
                message:    "There is no org related to ID",
                status:     400,
                processError: new Error("There is no organization related")
            }
            
            reject(emptyOrg)
        }

        const customer = organization.customers.id(customerId)

        if(!customer){
            const noCustomer = {
                message: "There is no customer with that ID",
                status:  400,
                processError: new Error("There is no customer")   
            }
            
            reject(noCustomer)
        }

        resolve(customer)
    })
}

export const deleteCustomer = (orgId, cId) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
            {
                "_id": orgId
            },
            {
                "$pull":{
                    "customers": {
                        "_id": cId
                    }
                }
            }
        )
        .then((result) => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const updateCustomerById = (orgId, id, edit) => {
    return new Promise(async(resolve, reject) => {
        try {
            const parsedEdit = {
                query:{
                    [getMongoQueryByObject(edit)]:{
                        [edit.key]:edit.value
                    }
                }
            }
            
            const queryOp = await orgModel.findOneAndUpdate(
                {
                    "_id":orgId,
                    "customers._id": id
                },
                parsedEdit.query
            )
    
            resolve(queryOp)
        } catch (err) {
            reject(err)
        } 
    })
}