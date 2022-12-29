//*db
import { mongoose } from '../../mongo.js'
let { ObjectId } = mongoose.Types

//*Schema
import Organization from '../../models/organization.js'
import Order from '../../models/order.js'

//*UTILS
import { addTimeToDate } from '../../utils/time.js'

//*Org controllers
import { getOrganizationById } from '../organization/store.js'

//*PRODUCTS CONTROLLERS
import { getAllProducts } from '../products/store.js'


import { buildProductionDataFromOrder } from '../production/controller.js'
import { getOrdersPrice, newOrderDateValidation } from './controller.js'
import { getProductionInContainer } from '../production/store.js'
import { getContainerById, getContainers } from '../container/store.js'

const orgModel = mongoose.model('organization', Organization)

export const getAllOrders = (orgId, req, filtered=false, filter=undefined, production=false) => {
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

        getOrganizationById(orgId, true)
        .then(async org => {
            if(!Boolean(org)) return reject(new Error(errorFromOrg))

            let orgOrders = org.orders
            
            try {
                if(filtered && filter){
                
                    const {key, value} = filter
                    if(value == "uncompleted" && key == "status") {
                        orgOrders = orgOrders.filter((order) => {
                            return (order.status != "delivered") && (order.status !== "cancelled")
                        })
    
                        orgOrders.orders = orgOrders
                    } else {
                        if(req && Boolean(req.query?.all)){
                            orgOrders = await orgModel.find(
                                {
                                    "_id":  orgId,
                                    [`orders.${key}`]: value
                                },
                                "orders -_id"
                            )
        
                            orgOrders = orgOrders[0]
                        } else { 
                            orgOrders = await orgModel.findOne(
                                {
                                    "_id":        orgId,
                                    [`orders.${key}`]: value
                                },
                                "orders -_id"
                            )

                            if(key === "_id" && orgOrders !== null){
                                orgOrders = orgOrders.orders.filter((order) => order[key].equals(value))
                            }

                            if(key !== "_id" && orgOrders !== null){
                                orgOrders = orgOrders.orders.filter((order) => order[key] === value)
                            }
                            
                        }
                        
                    }
                    
                }
                
                if(req === undefined) {
                    return resolve(orgOrders)
                }
                
                // if(!Object.keys(req?.query).includes("production") && !Boolean(req.query?.production)){
                //     return resolve(orgOrders)
                // }

                if(!orgOrders) {
                    return resolve([])
                }
                
                const mappedOrders = orgOrders.map((order, orderIndex) => {
                    // const production = getOrderProdData(order, org.containers[0].products, true)
                    const mutableOrder = order.toObject()
                    return mutableOrder
                })
                
                resolve(mappedOrders)
            } catch (err) {
                console.log(err)
                errorFromOrg.processError = err.message
                reject(new Error(JSON.stringify(errorFromOrg)))
            }

        })
        .catch(err => {
            console.log(err)
            errorFromOrg.processError = err.message
            reject(new Error(JSON.stringify(errorFromOrg)))
        })
    
    })
    
}
export const getFilteredOrders = (orgId, req = undefined, production, filter = undefined) => {
    return new Promise((resolve, reject) => {
        let key
        let value
        let mappedFilter

        if(req === undefined) {
            if(filter !== undefined){
                mappedFilter = filter
            }
        } else {
            if(Object.keys(req.query).includes('key') && Object.keys(req.query).includes('value')){
                key = req.query.key
                value = req.query.value
                mappedFilter = {key, value}
            } else if (req.params && filter === undefined) {
                key = Object.entries(req.params)[0][0]
                value = Object.entries(req.params)[0][1]
                mappedFilter = {key, value}
            }
        }

        

        getAllOrders(orgId, req, true, mappedFilter, production)
        .then((orders) => {
            if(orders === null) {
                resolve([])
            }
            
            resolve(orders)
        })
        .catch((err) => {
            return reject("Error getting filtered orders")
        })
    })
}

export const deleteOrders = (orgId, orders) => {
    return new Promise(async(resolve, reject) => {
        const org = await getOrganizationById(orgId)
        const find = await orders.map(async(order) => {
            const found = await org.orders.find((ordr)=> ordr._id.equals(order._id))

            return found
        })

        Promise.all(find)
        .then((found) => {
            const operations = found.map(async(order) => {
                const operation = await orgModel.updateOne({_id:orgId},{"$pull":{
                    "orders": {
                        "_id":order._id
                    }
                }})
                return operation
            })

            Promise.all(operations)
            .then((result) => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
            
        })
        .catch((err) => {
            console.log(err)
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

        
        const priceFailure = {
            "message": "There was an error calculating the price",
            "status":   500
        }
        let allProducts
        let mappedProducts
        let mappedAndUpdatedProducts

        
        try {
        
            
            //*Get all products of container to make validations (products on order have no the complete data)
            allProducts = await getAllProducts(orgId)
            
            newOrderDateValidation(order, allProducts)
            
            mappedProducts = order.products.map(async (prod) => {
                const dbProduct = allProducts.find((product) => {
                    return product._id.equals(prod._id)
                })


                
                // await orgModel.updateOne({_id:orgId,"containers.0.products":{"$elemMatch":{_id:product._id}}},{"$set":{
                //     "containers.0.products.$.status":"seeding"
                // }})
            
                return {
                    _id:            prod._id,
                    name:           prod.name,
                    status:         prod.status,
                    seedId:         dbProduct?.seed?.seedId,
                    packages:       prod.packages,
                    mix:            dbProduct.mix.isMix,
                    price:          dbProduct.price
                }
            })

            mappedAndUpdatedProducts = await Promise.all(mappedProducts)

            let prc = getOrdersPrice(order, allProducts)
            
            if(prc === undefined || prc === null){
                return reject(new Error(JSON.stringify(priceFailure)))
            }

            let end = addTimeToDate(new Date(), { w: 2 })

            let overhead = await getContainers({organization:orgId})

            console.log(overhead)
            
            const isValidContainerResponse = overhead !== null && overhead !== undefined && overhead.containers.length === 1
            
            if (isValidContainerResponse){
                overhead = (overhead.containers[0].config.overhead)/100
            }
            
            let production = await buildProductionDataFromOrder({...order, _id:id}, allProducts, overhead)

        
            if(allProducts && allProducts.length >0){
                let orderMapped = {
                    _id:            id,
                    organization:   orgId,
                    customer:       order.customer._id,
                    price:          prc,
                    date:           order.date,
                    end:            end,
                    products:       mappedAndUpdatedProducts,
                    status:         "production"
                }
                
                getOrganizationById(orgId)
                .then(organization => {
                    if(!organization){
                        return reject(new Error(JSON.stringify(emptyOrgs)))
                    }
                    
                    organization.orders.push(orderMapped)

                    production.forEach((productionModel) => {
                        organization.containers[0].production.push(productionModel)
                    })
                    
                    organization.save((err, org) => {
                        if(err) {
                            console.log(err)
                            reject(new Error(JSON.stringify(errorSaving)))
                        }
                        
                        
                        resolve(orderMapped)
                    })
                })
                .catch(err => {
                    console.log(err)
                    reject(new Error(JSON.stringify(errorFromOrg)))
                })    
            } else {
                reject(new Error(JSON.stringify(noProducts)))
            }
            
        } catch (err) {
            reject(err)
        }
    })
}

export const getOrdersByProd = (orgId, id) => {
    return new Promise(async (resolve, reject) => {
        // TODO: Corregir query
        const orgOrdersByProd = await orgModel.aggregate(
            [
                {
                    "$match": {
                        "_id": mongoose.Types.ObjectId(orgId),
                        "orders.products._id": mongoose.Types.ObjectId(id)
                    }
                },
                {
                    "$unwind": "$orders"
                },
                {
                    "$match": {
                        "orders.products._id": mongoose.Types.ObjectId(id)
                    }
                },
            ]
        )
        const mapOrdersFromAggregation = orgOrdersByProd.map((orgModel) => {
            return orgModel.orders 
        }) 

        resolve(mapOrdersFromAggregation)
    })
}

export const updateOrder = (org, orderId, body) => {
    return new Promise((resolve, reject) => {
        orgModel.findById(org).exec()
        .then((organization) => {
            if(organization){
                const dbOrder = organization.orders.find((order) => order._id.equals(orderId))
    
                if(!dbOrder) {
                    return reject(dbOrder)
                }

                //**VALID STATUSES FOR ORDERS about production: ["received","production", "packed", "delivered"] */
                //**VALID STATUSES FOR ORDERS about payment: ["unpaid","paid","pending"] */

                body.paths.forEach(({path, value}, index) => {
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

export const updateManyOrders = (filter, update) => {
    return new Promise(async(resolve, reject) => {
        try {
            const updateResult = await orgModel.updateOne(filter, update)
            resolve(updateResult)
        } catch (err) {
            reject(err)
        }
    })
}


export const getOrderById = async (orgId, orderId) => {
    const filter = {
        "key":"_id",
        "value":orderId
    }
    
    const orders = await getFilteredOrders(orgId, undefined, false, filter)

    return orders
}
//* production status
//* seeding
//* growing -- 2 days p/w 7am
//* harvestReady
//* harvested
//* packaged
//* delivered


//* payment status
//* unpaid
//* paid
