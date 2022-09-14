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

export const getAllOrders = (orgId, req, filtered=false, filter=undefined) => {
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
        .then(org => {
            if(!Boolean(org)) return reject(new Error(errorFromOrg))

            let orgOrders = org.orders
            if(!orgOrders) return resolve([])
            if(filtered && filter){
                const {key, value} = filter
                const param = req.params.status
                orgOrders = orgOrders.filter((order) => {
                    if(param && key && value){
                        let prm = order.status === param

                        if(key === "_id"){
                            return prm && order[key].equals(value)        
                        }
                        
                        
                        return prm && order[key] === value
                    }

                    if(!param && key && value){
                        if(key === "_id"){
                            return order[key].equals(value)
                        }
                        
                        return order[key] === value
                    }

                    if(param && !key && !value){
                        return order.status === param
                    }
                })
                
            }


            const mappedOrders = orgOrders.map((order, orderIndex) => {
                const production = getOrderProdData(order, org.containers[0].products, true)
                const mutableOrder = order.toObject()
                const mappedProds = mutableOrder.products.map((product, index, thisArr) => {
                    if(product.mix){
                        const correspondingMixProducts = production.filter((prodData) => {
                            const sameOrder = prodData.orderId.equals(order._id)
                            const sameMix =  prodData.mixId.equals(product._id)
                            return sameOrder && sameMix && prodData.mix
                        })

                        product.products = correspondingMixProducts
                        return {...product}
                    }

                    let found = production.find((prod) => {
                        return prod.id.equals(product._id)
                    })
                    return {productionData:found, ...product}
                })

                mappedProds.forEach(prod => {

                    if(prod.mix){
                        prod.products.forEach((mixProd) => {
                            delete mixProd.mixId
                            delete mixProd.orderId
                            delete mixProd.mix
                        })
                    } else {
                        delete prod.productionData.id
                    }
                    
                })
                mutableOrder.products = mappedProds

                return mutableOrder
            })
            
            resolve(mappedOrders)
        })
        .catch(err => {
            console.log(err)
            errorFromOrg.processError = err.message
            reject(new Error(JSON.stringify(errorFromOrg)))
        })
    
    })
    
}
export const getFilteredOrders = (orgId, req) => {
    return new Promise((resolve, reject) => {
        let key
        let value
        if(req.query){
            key = req.query.key
            value = req.query.value
        }

        getAllOrders(orgId, req, true, {key, value})
        .then((orders) => {
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
        const allProducts = await getAllProducts(orgId)

        const mappedProducts = order.products.map((prod) => {
            const isMix = allProducts.find((product) => {
                return product._id.equals(prod._id)
            }).mix.isMix

            return {
                _id:            prod._id,
                name:           prod.name,
                status:         prod.status,
                seedId:         prod?.seedId,
                packages:       prod.packages,
                mix:            isMix
            }
        })

        let prc = getOrdersPrice(order, allProducts)
        if(prc === undefined || prc === null){
            return reject(new Error(JSON.stringify(priceFailure)))
        }
        let end = addTimeToDate(new Date(), { w: 2 })
        let prodData = getOrderProdData(order, allProducts)
        
        
        if(allProducts && allProducts.length >0){
            let orderMapped = {
                _id:            id,
                organization:   orgId,
                customer:       order.customer._id,
                price:          prc,
                date:           order.date,
                end:            end,
                productionData: prodData,
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

        const orderByProd = orders.map((order) => {
            const hasProd = order.products.find((prod) => prod._id.equals(id))
            if(hasProd !== undefined && hasProd !== null){
                return order
            }

            return false
        })

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

const deleteOrder = (orgId,orderId,req,filter=undefined) => {
    return new Promise(async (resolve, reject) => {
        try {
            const org = await getOrganizationById(orgId)
        } catch (err){
            console.log(err)
        }        

        if(org) {
            const order = org.orders.id(orderId)
            let filter = "id"
            let value = orderId
            org.orders.delteOne({[filter]:{"eq":{value}}})
        }
    })
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
