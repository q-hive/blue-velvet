import { mongoose } from '../../mongo.js'
let { ObjectId } = mongoose.Types

//*Schema
import Organization from '../../models/organization.js'
import Order from '../../models/order.js'

import { getProductionForOrder } from '../production/store.js'
import { addTimeToDate } from '../../utils/time.js'
import { getOrganizationById } from '../organization/store.js'
import { getOrdersPrice, getOrderProdData } from './controller.js'
import { getAllProducts } from '../products/store.js'

const orgModel = mongoose.model('organization', Organization)

export const getAllOrders = (orgId) => {
    return new Promise((resolve, reject) => {
        const orgIDNotProvided = {
            "message":  "Organization ID was not provided",
            "status":   400
        }
        const errorFromOrg = {
            "message":  "Error obtaining organization",
            "status":    500
        }
        
        if(!orgId){
            return reject(new Error(JSON.stringify(orgIDNotProvided)))
        }

        getOrganizationById(orgId)
        .then(org => {
            resolve(org.orders)
        })
        .catch(err => {
            errorFromOrg.processError = err.message
            reject(new Error(JSON.stringify(errorFromOrg)))
        })
    
    })
    
}

export const createNewOrder = (orgId, order) => {
    return new Promise(async (resolve, reject) => {
        const errorFromOrg = {
            "message":  "Error obtaining organization",
            "status":    500
        }

        const errorSaving = {
            "message": "Error saving organization",
            "status":   400
        }
        const emptyOrgs = {
            "message":  "Organizations DB empty",
            "status":    204
        }

        const noProducts = {
            "message":  "No products in DB",
            "status":   204
        }
        
        // * Id for order
        let id = new ObjectId()

        const mappedProducts = order.products.map((prod) => {
            return {
                _id:        prod._id,
                name:       prod.name,
                status:     prod.status,
                seedId:     prod.seedId,
                packages:   prod.packages
            }
        })

        const allProducts = await getAllProducts(orgId)

        if(allProducts && allProducts.length >0){
            let orderMapped = {
                _id:            id,
                organization:   orgId,
                customer:       order.customer._id,
                price:          getOrdersPrice(order, allProducts),
                date:           order.date,
                end:            addTimeToDate(new Date(), { w: 2 }),
                productionData: getOrderProdData(order, allProducts),
                products:       mappedProducts,
                status:         order.status
            }
            
            getOrganizationById(orgId)
            .then(organization => {
                if(!organization){
                    return reject(new Error(JSON.stringify(emptyOrgs)))
                }
                
                organization.orders.push(orderMapped)
    
                organization.save((err, org) => {
                    if(err) {
                        errorSaving.processError = err
                        reject(new Error(JSON.stringify(errorSaving)))
                    }
        
                    resolve(orderMapped)
                })
            })
            .catch(err => {
                errorFromOrg.processError =  err
                reject(new Error(JSON.stringify(errorFromOrg)))
            })    
        } else {
            reject(new Error(JSON.stringify(noProducts)))
        }
    })
}

export const getOrdersByProd = (orgId, id) => {
    return new Promise(async (resolve, reject) => {
        // TODO: Corregir query
        const org = await orgModel.findById(orgId)

        if(!org){
            return reject("No organization found")
        }

        const orders = org.orders
        
        if(!orders ||  orders.length == 0) {
            return resolve(orders)
        }

        const orderByProd = orders.products.id(id)

        resolve(orderByProd)
    })
}

export const updateOrder = (org, orderId, body) => {
    return new Promise((resolve, reject) => {
        orgModel.findById(org).exec()
        .then((organization) => {
            if(organization){
                const dbOrder = organization.orders.find((order) => order._id.equals(orderId))
    
                if(!dbOrder) {
                    return reject(new Error(JSON.stringify({"message":"No order found", "status":204})))
                }

                body.paths.forEach(({path, value}, index) => {
                    // const isNested = /^[a-z]*.[a-z]$/

                    dbOrder[path] = value
                })

                
                organization.save((err, doc) => {
                    if(err) reject(JSON.stringify({"message":"Error saving organization", "status": 500, "processError":err}))

                    resolve(dbOrder)
                })
                return
            }

            return reject(new Error(JSON.stringify({"message":"No organization found", "status": 204})))
            
            
        })
        .catch((err) => {
        
        })
    })
}