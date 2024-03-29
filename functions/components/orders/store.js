//*db
import { mongoose } from '../../mongo.js'
let { ObjectId } = mongoose.Types

//*Schema
import Organization, { organizationModel } from '../../models/organization.js'
import Order from '../../models/order.js'

//*UTILS
import { actualMonthInitialDate, addTimeToDate } from '../../utils/time.js'

//*Org controllers
import { getOrganizationById } from '../organization/store.js'

//*PRODUCTS CONTROLLERS
import { getAllProducts } from '../products/store.js'


import { buildProductionDataFromOrder } from '../production/controller.js'
import { getOrdersPrice, newOrderDateValidation, setOrderAbonment } from './controller.js'
import { getProductionInContainer } from '../production/store.js'
import { getContainerById, getContainers } from '../container/store.js'

const orgModel = organizationModel;

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

export const getMonthlyOrders = (orgId) => {
    return new Promise((resolve, reject) => {
        organizationModel.findOne(
            {"_id":mongoose.Types.ObjectId(orgId)},
            {
                "orders":{
                    "$filter":{
                        "input":"$orders",
                        "as":"order",
                        "cond": { "$gte":["$$order.created", actualMonthInitialDate()] }
                    }
                }
            }
        )
        .then((data) => {
            console.log(data)
            resolve(data.orders)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

export const getMonthlyOrdersByCustomer = (orgId, customerId) => {
    return new Promise((resolve, reject) => {
        organizationModel.findOne(
            {"_id":mongoose.Types.ObjectId(orgId)},
            {
                "orders":{
                    "$filter":{
                        "input":"$orders",
                        "as":"order",
                        "cond": {
                            "$and": [
                                { "$gte":["$$order.created", new Date(actualMonthInitialDate())] },
                                { "$lt":["$$order.created", new Date(new Date().getUTCFullYear(),new Date().getUTCMonth()+1,1)] },
                                { "$eq":["$$order.customer", mongoose.Types.ObjectId(customerId)] }
                            ]
                        }
                    }
                }
            }
        )
        .then((data) => {
            console.log(data)
            resolve(data.orders)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

export const deleteOrdersDirect = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        const values = {
            "_id":mongoose.Types.ObjectId(req.query.value)
        }
        
        let traysToReduce
        try {
            traysToReduce =  await organizationModel.aggregate([
                {
                  '$match': {
                    '_id': new ObjectId('636ae6a18453ae9796473eae')
                  }
                }, {
                  '$unwind': {
                    'path': '$containers', 
                    'preserveNullAndEmptyArrays': false
                  }
                }, {
                  '$project': {
                    'containers': {
                      'production': true
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$containers.production', 
                    'preserveNullAndEmptyArrays': false
                  }
                }, {
                  '$match': {
                    '$and': [
                      {
                        '$or': [
                          {
                            'containers.production.ProductionStatus': 'growing'
                          }, {
                            'containers.production.ProductionStatus': 'harvestReady'
                          }
                        ], 
                        'containers.production.RelatedOrder': new ObjectId('63f0b112f9ba9d5c7d916af1')
                      }
                    ]
                  }
                }, {
                  '$group': {
                    '_id': 'trays', 
                    'totalTrays': {
                      '$sum': '$containers.production.trays'
                    }
                  }
                }
            ])

            traysToReduce = traysToReduce.reduce((acum,actual) => acum + actual.totalTrays,0)
            
            console.log(traysToReduce)
        } catch (err) {
            reject(err)
        }
        
        
        const deletionOp = await organizationModel.updateOne({"_id":res.locals.organization},{
            "$pull":{
                "containers.$[].production":{
                    "RelatedOrder":values[req.query.key]
                },
                "orders":{
                    [req.query.key]:values[req.query.key]
                }
            },
        })

        console.log("Deletion op")
        console.log(deletionOp)
        
        organizationModel.updateOne({"_id":res.locals.organization},{
            "$inc":{
                "containers.$[].available": traysToReduce
            }
        })
        .then(result => resolve(result))
        .catch(err => reject(err))
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
        const priceFailure = {
            "message": "There was an error calculating the price",
            "status":   500
        }
        const errorGettingProducts = {
            "message":"There was an error while getting products to match with the order.",
            "status":500
        }
        const invalidDate = {
            "message":"The date for the order is invalid, please compare the production times with the date you selected.",
            "status":400
        }
        
        // * Id for order
        let id = new ObjectId()

        
        let allProducts
        let mappedProducts
        let mappedAndUpdatedProducts
        let prc

        
        //*Get all products of container to make validations (products on order have no the complete data)
        try{
            allProducts = await getAllProducts(orgId)
            console.log(allProducts)
        }catch(err){
            console.log(err)
            return reject(new Error(JSON.stringify(errorGettingProducts)))
        }
        
        //*Check if is a valid date compared with production times estimations.
        try {
            newOrderDateValidation(order, allProducts)
        } catch (err){
            console.log(err)
            return reject(new Error(JSON.stringify(invalidDate)))
        }

        //*Mapea los productos para completar el modelo de la base de datos en la propiedad products
        try {
            mappedProducts = order.products.map((prod) => {
                const dbProduct = allProducts.find((product) => {
                    return product._id.equals(prod._id)
                })
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

            mappedAndUpdatedProducts = mappedProducts;
        } catch(err){
            reject(err)
        }

        try{
            prc = getOrdersPrice(order, allProducts)
            
            if(prc === undefined || prc === null){
                return reject(new Error(JSON.stringify(priceFailure)))
            }
        }
        catch(err){
            reject(err)
        }

        try{
            let overhead = await getContainers({organization:orgId})

            const isValidContainerResponse = overhead !== null && overhead !== undefined && overhead.containers.length === 1
            
            if (isValidContainerResponse){
                overhead = (overhead.containers[0].config.overhead)/100
            } else {
                overhead = 0;
            }
            
            let production = await buildProductionDataFromOrder({...order, _id:id}, allProducts, overhead)

        
            if(allProducts && allProducts.length >0){
                let orderMapped = {
                    _id:            id,
                    organization:   orgId,
                    customer:       order.customer._id,
                    price:          prc,
                    date:           order.date,
                    products:       mappedAndUpdatedProducts,
                    status:         "production",
                    cyclic:          order.cyclic,
                }


                getOrganizationById(orgId)
                .then(async organization => {
                    if(!organization){
                        return reject(new Error(JSON.stringify(emptyOrgs)))
                    }
                    
                    organization.orders.push(orderMapped)

                    production.forEach((productionModel) => {
                        organization.containers[0].production.push(productionModel)
                    })

                    try {
                        await organization.save()
                    }catch(err) {
                        console.log(err)
                        reject(new Error(JSON.stringify(errorSaving)))
                    }
                    console.log("Order mapped and saved, checking if it is cyclic")
                    if(order.cyclic){
                        const orgWithNewOrdersFiltered = await organizationModel.findOne(
                            {
                                "_id":mongoose.Types.ObjectId(orgId)
                            },
                            {
                                "orders":{
                                    "$filter":{
                                        "input":"$orders",
                                        "as":"order",
                                        "cond":{ "$eq":["$$order._id", id] }
                                    }
                                }
                            }
                        ).exec()

                        
                        let jobName
                        try {
                            console.log("Order abonment required, setting up the background job")
                            jobName = setOrderAbonment(orgId,orgWithNewOrdersFiltered.orders[0],orderMapped, allProducts, overhead)
                        } catch (err) {
                            reject(err)
                        }
                        
                        try {
                            await organizationModel.updateOne(
                                {
                                    "_id":mongoose.Types.ObjectId(orgId)
                                },
                                {
                                    "$set":{
                                        "orders.$[order].job":`Reorder-${id}`
                                    }
                                },
                                {
                                    "arrayFilters":[
                                        {"order._id":id}
                                    ]
                                }
                            )
                        } catch (err) {
                            reject(err)
                        }

                        resolve()
                        return
                    }

                    resolve()
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
