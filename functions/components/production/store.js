import Organization from '../../models/organization.js'
import { mongoose } from '../../mongo.js'
import { dateToArray, nextDay } from '../../utils/time.js'
import { getContainers, updateContainerById } from '../container/store.js'
import { buildOrderFromExistingOrder } from '../orders/controller.js'
import { getOrderById, insertNewOrderWithProduction, updateOrder, insertOrderAndProduction } from '../orders/store.js'
import { getAllProducts } from '../products/store.js'
import { buildProductionDataFromOrder, grouPProductionForWorkDay, scheduleTask } from './controller.js'
import { getOrganizationById } from '../organization/store.js'
import moment from 'moment'
import { getInitialStatus } from './controller.js'
let { ObjectId } = mongoose.Types

const orgModel = mongoose.model('organizations', Organization)

export const productionCycleObject = {
    "preSoaking": {
        "next":"seeding",
        "hasBackGroundTask":false,
        "requireNewDoc":true,
        "affectsCapacity":{
            "affect":false,
            "how":null
        }
    },
    // "soaking1":{
    //     "next":"soaking2",
    //     "hasBackGroundTask":true,
    //     "requireNewDoc":true,
    //     "affectsCapacity":{
    //         "affect":false,
    //         "how":null
    //     }
    // },
    // "soaking2":{
    //     "next":"seeding",
    //     "hasBackGroundTask":true,
    //     "requireNewDoc":true,
    //     "affectsCapacity":{
    //         "affect":false,
    //         "how":null
    //     }
    // },
    "harvestReady":{
        "next":"packing",
        "hasBackGroundTask":false,
        "requireNewDoc":true,
        "affectsCapacity":{
            "affect":false,
            "how":null
        }
    },
    "packing": {
        "next":"ready",
        "hasBackgroundTask":false,
        "requireNewDoc":true,
        "affectsCapacity":{
            "affect":true,
            "how":"inc"
        }
    },
    "ready": {
        "next":"delivered",
        "hasBackgroundTask":false,
        "requireNewDoc":true,
        "affectsCapacity":{
            "affect":false,
            "how":null
        }
    },
    "seeding":{
        "next":"growing",
        "hasBackGroundTask":false,
        "requireNewDoc":true,
        "affectsCapacity":{
            "affect":false,
            "how":null
        }
    },
    "growing":{
        "next":"harvestReady",
        "hasBackGroundTask":true,
        "requireNewDoc":true,
        "affectsCapacity":{
            "affect":true,
            "how":"dec"
        }
    },
}


export const getProductionInContainer = async (orgId, containerId) => {
    return new Promise((resolve, reject) => {
        orgModel.findOne(
            {
                "_id":mongoose.Types.ObjectId(orgId), 
                "containers._id":mongoose.Types.ObjectId(containerId)
            },
            {
                "containers.production.$":true
            }
        )
        .then((doc) => {
            if(!doc){
                resolve([])
                return
            }
            
            
            const result = doc.containers[0]?.production
            if(!result){
                resolve([])
                return
            }

            resolve(result)

        })
        .catch((err) => reject(err))
    })
}

export const insertWorkDayProductionModel = (orgId,container,productionModel) => {
    return new Promise(async(resolve, reject) => {
        try {
            const updateOperation = await orgModel.updateOne(
                {
                    "_id":mongoose.Types.ObjectId(orgId),
                    "containers._id":mongoose.Types.ObjectId(container)
                },
                {
                    "$set": {"containers.$.workday":{"production":productionModel}}
                }
            )
            resolve(updateOperation)
        } catch (err) {
            reject(err)
        }
    })
}

export const startBackGroundTask = (config) => {
    scheduleTask(config)
    return
}

export const getPosibleStatusesForProduction = () => {
    const statuses = Object.keys(productionCycleObject)
    return statuses
}

// Actualiza la produccion al siguiente status del que se selecciono a terminar
export const nextStatusForProduction = (productionModels, actualStatus) => {
    const cycleModel = productionCycleObject

    if(Array.isArray(productionModels)){
        productionModels.forEach((production) => {

            const nextProductionStatus = cycleModel[actualStatus ? actualStatus : production.ProductionStatus].next 

            production.ProductionStatus = nextProductionStatus
        })
    }

    return productionModels

}

export const updateOrdersInModels = async (updatedModels, orgId, container) => {
    let bodyQuery = {
        "orders":{
            "_id":{
                "paths":[{"path":"","value":""}]
            },
        }
    }
    
    await Promise.all(
        updatedModels.map(async(productionModel) => {

            const productionDB = await getProductionByOrderId(orgId, container, productionModel.RelatedOrder)
            
            const indexOfModelInDB = productionDB.findIndex((model) => model._id.equals(productionModel._id))
            
            productionDB[indexOfModelInDB].ProductionStatus = productionModel.ProductionStatus 
            
            const statusInProductionDB = productionDB.map((productionmodel) => productionmodel.ProductionStatus).filter((element) => element != undefined)
            console.log("Production status of the order" + productionModel.RelatedOrder + " in DB woud be:  " + statusInProductionDB)
            console.log("with the applied update")
            
            bodyQuery.orders[productionModel.RelatedOrder.toString()] = {
                "paths":[{"path":"status","value":productionModel.ProductionStatus}]
            }
    
            
            //*Status in DB must be equal (packing)i n all production models related to the order before updating status
            await updateOrder(orgId, productionModel.RelatedOrder, bodyQuery.orders[productionModel.RelatedOrder.toString()])
            //*Add order to DB of packaging

            // if(nonRepeatedStatus[0] === "packing"){
            //     await orgModel.updateOne({"_id":mongoose.Types.ObjectId(orgId), "$push":{"packaging": productionModel.RelatedOrder}})
            // }

            // if(nonRepeatedStatus[0] === "ready"){
            //     await orgModel.updateOne({"_id":mongoose.Types.ObjectId(orgId), "$push":{"dliveryReady": productionModel.RelatedOrder}})
            //     await orgModel.updateOne({"_id":mongoose.Types.ObjectId(orgId), "$pull":{"packaging": productionModel.RelatedOrder}})
            // }
            
        }).filter((elem) => elem != undefined)
    )
    
    

}

export const updateProduction = async (orgId, container, id, modifiedModels, statuses, userUID) => {
    //*CHANGED TO FOR OF LOOP TO MANAGE SCOP OF ORDERUPDATED VARIABLE (BUT ITS BLOCKING THE MAIN THREAD)
    const updateOperation = modifiedModels.map(async (newmodel) => {
        console.log("Updating production model")
        console.log(newmodel)
        const productionStatus = newmodel.ProductionStatus
        console.log("Production model updating to ->", productionStatus)
        
        const op = await orgModel.updateOne(
            {
                "_id":mongoose.Types.ObjectId(orgId),
                "containers":{
                    "$elemMatch": {
                        "_id":mongoose.Types.ObjectId(container),
                        "production":{
                            "$elemMatch":{
                                "_id":mongoose.Types.ObjectId(newmodel._id)
                            }
                        }
                    }
                }
            },
            {
                "$set":{
                    "containers.$.production.$[prod]":newmodel
                }
            },
            {
                "arrayFilters":[{"prod._id":mongoose.Types.ObjectId(newmodel._id)}]
            }
        )

        if(productionCycleObject[productionStatus]?.hasBackGroundTask){
            console.log("The production status " + productionStatus + " has a background task")
            await scheduleTask({organization:orgId, container, production:newmodel, name:"updateForProduction"})
        }

        if(productionCycleObject[productionStatus]?.affectsCapacity.affect){
            let trays = newmodel.trays
            console.log("El container must be updated")
            if(productionCycleObject[productionStatus]?.affectsCapacity.how === "dec"){
                trays = trays
            }

            if(productionCycleObject[productionStatus]?.affectsCapacity.how === "inc"){
                trays = -trays
            }
            
            await updateContainerById(orgId, container, {query:"add",key:"available", value:-trays})
        }

        
        console.log("Production status of the order " + newmodel.RelatedOrder + " in DB is:  " + statuses)


        const query = {
            orders:{
                "_id":{
                    "paths":[{"path":"","value":""}]
                },
            }
        }
        query.orders[newmodel.RelatedOrder.toString()] = {
            "paths":[
                {"path":"status","value":newmodel.ProductionStatus},
                {"path":"deliveredBy","value":userUID}
            ]
        }

        query.orders[newmodel.RelatedOrder.toString()] = {
            paths: [
              { path: "status", value: newmodel.ProductionStatus },
              ...(newmodel.ProductionStatus === 'delivered' 
                ? [{ path: "deliveredBy", value: userUID }]
                : [])
            ],
          };

        await updateOrder(orgId, newmodel.RelatedOrder, query.orders[newmodel.RelatedOrder.toString()], newmodel.ProductID)

        try {
            // if (newmodel.ProductionStatus === "delivered"){
            //     console.log("Creating new order if its cyclic")
            //     console.log("Order updated: " + orderUpdated)
            //     const orders = await getOrderById(orgId, newmodel.RelatedOrder)
            //     if(orders[0] && orders[0].cyclic && !orderUpdated){
            //         let order = orders[0]
            //         let org = await getContainers({organization:orgId})

            //         const isValidContainerResponse = org !== null && org !== undefined && org.containers.length === 1
            //         let overhead = 0;
            //         if (isValidContainerResponse){
            //             overhead = (org.containers[0].config.overhead)/100
            //         } 
            //         const allProducts = await getAllProducts(orgId)
            //         //*SET ORDERS PRODUCTS AND ORDER STATUSES TO INITIAL STATE 
            //         const newOrder = buildOrderFromExistingOrder(order,order,allProducts)
            //         console.log(newOrder.products)
            //         //*This is to avoid modifying the original order to be saved
            //         const orderToBuildProduction = JSON.parse(JSON.stringify(newOrder))
            //         const newProduction = await buildProductionDataFromOrder(orderToBuildProduction,allProducts, overhead)

                    
            //         await insertNewOrderWithProduction(orgId, newOrder, newProduction)
            //         orderUpdated = true
                    
            //     }
            //     console.log("No order found or its not cyclic")
            // }
        } catch(err) {
            console.log("Error creating new order from cyclic order")
            console.log(err)
        }

        return op
    })

    const up = await Promise.all(updateOperation)

    return up
}
//*THIS FUNCTION ONLY UPDATES TO THE NEXT STATUS CORRESPONDING TO THE PRODUCTION CYCLE ACCORDING THE ACTUAL STATUS OF TASK FINISHED
export const updateManyProductionModels = (orgId, container, productionModelsIds, actualStatus, tz, userUID) => {
    return new Promise(async(resolve, reject) => {
        console.log("Updating production models in " + container +  " container" + "by uid:" + userUID)
        console.log("***************");
        
        let filteredProductionModels = []
        const getProduction = productionModelsIds.map(async (id) => {
            const productionModel = await orgModel.findOne({
                "_id":mongoose.Types.ObjectId(orgId),
                "containers":{
                    "$elemMatch": {
                        "_id":mongoose.Types.ObjectId(container),
                        "production":{
                            "$elemMatch":{
                                "_id":mongoose.Types.ObjectId(id)
                            }
                        }
                    }
                }
            },
            {
                "containers.$":1
            }
            )
            
            productionModel.containers.forEach((container) => {
                const productionModelFound = container.production.find((production) => production._id.equals(id))

                console.log("Production model found")
                filteredProductionModels.push(productionModelFound)
            })
        })

        await Promise.all(getProduction)
        const modifiedModels = nextStatusForProduction(filteredProductionModels, actualStatus)
        const allProductionStatus = await orgModel.aggregate([
            {
                "$match":{
                    "_id":mongoose.Types.ObjectId(orgId)
                }
            },
            {
                "$unwind":"$containers"
            },
            {
                "$unwind":"$containers.production"
            },
            {
                "$match":{
                    "containers.production.RelatedOrder":{
                        "$in":modifiedModels.map((model) => model.RelatedOrder)
                    }
                }
            },
            {
                "$group":{
                    "_id":"$containers.production.RelatedOrder",
                    "productionStatus":{
                        "$push":"$containers.production.ProductionStatus"
                    }

                }
            }
        ])
        let allStatuses = allProductionStatus.length>0 ? Array.from(new Set(allProductionStatus[0].productionStatus)).filter((element) => element != undefined) : allProductionStatus
        try {
            const updateProd = await updateProduction(orgId, container, null, modifiedModels, allStatuses, userUID)
    
            if (modifiedModels.length>0 && allStatuses.length === 1 && allStatuses[0] === "ready"){
                console.log("Creating new order if its cyclic")
                const orders = await getOrderById(orgId, modifiedModels[0].RelatedOrder)
                console.log(orders)
                if(orders[0] && orders[0].cyclic){
                    let baseOrder = orders[0]
                    const relatedOrder = await getOrderById(orgId, baseOrder.next)                
                    
                    if(relatedOrder[0] && relatedOrder[0]){
                        const allProducts = await getAllProducts(orgId);
                        const relatedOrderStatuses = Array.from(
                            new Set(relatedOrder[0].products.map((prod) => prod.status))
                        );
                        
                        
                        let org = await getOrganizationById(orgId);
                        let tempId = new ObjectId();
                        
                        const relOrderIndex = org.orders.findIndex(order => order._id.equals(relatedOrder[0]._id))

                        if(relOrderIndex !== -1){
                            org.orders[relOrderIndex].next = tempId
                        }
                        
                        const newProducts = relatedOrder[0].products.map((prod) => {
                            const product = allProducts.find((fprod) => {
                                if(typeof fprod._id === "object"){
                                    return fprod._id.equals(prod._id)
                                }
                    
                                if (typeof prod._id === "object"){
                                    return prod._id.equals(fprod._id)
                                }
                                
                                return fprod._id == prod._id 
                            })
                            prod.status = getInitialStatus(product)
                            return prod
                        })
                        
                        let tempOrder = {
                            _id: tempId,
                            organization: orgId,
                            customer: relatedOrder[0].customer,
                            next:null,
                            price: relatedOrder[0].price,
                            address: relatedOrder[0].address,
                            products: newProducts,
                            cyclic: relatedOrder[0].cyclic,
                            status: relatedOrderStatuses.length === 1 ? 'seeding' : 'production',
                            date: moment(relatedOrder[0].date).add(7, "days")
                        };

                        await insertOrderAndProduction(org, tempOrder, allProducts, tz)
                            
                    }
                }
                console.log("No order found or its not cyclic")
            }
        
            resolve(updateProd)
        } catch (err){
            reject(err)
        }

        
    })
}

export const getProductionByStatus = (orgId, container, status) => {
    return new Promise((resolve, reject) => {
        console.log(orgId,container)
        
        orgModel.aggregate(
            [
                {
                    "$match": {
                        "_id":mongoose.Types.ObjectId(orgId),
                    }   
                },
                {
                    "$unwind":"$containers"
                },
                {
                    "$match":{
                        "containers._id":mongoose.Types.ObjectId(container)
                    }
                },
                {
                    "$match":{
                        "containers.production.ProductionStatus":status
                    }  
                },
                {
                    "$project":{
                        "containers":{
                            "_id":1,
                            "production":1
                        }
                    }
                }
            ]
        )
        .then((result) => {
            console.log(result)

            if(result.length === 0){
                resolve(result)
            }
            
            const grouppedProd = grouPProductionForWorkDay("status",result[0].containers.production, "hash")
            resolve(grouppedProd)
        })
        .catch((err) => {
            reject(err)
        })

    })
}

export const getProductionByOrderId = (orgId, container, orderId) => {
    return new Promise((resolve, reject) => {
        orgModel.aggregate(
            [
                {
                    "$match": {
                        "_id":mongoose.Types.ObjectId(orgId),
                    }   
                },
                {
                    "$unwind":"$containers"
                },
                {
                    "$match":{
                        "containers._id":mongoose.Types.ObjectId(container)
                    }
                },
                {
                    "$unwind":"$containers.production"
                },
                {
                    "$match":{
                        "containers.production.RelatedOrder":mongoose.Types.ObjectId(orderId)
                    }  
                },
                {
                    "$replaceRoot": {
                        "newRoot": "$containers.production"
                    }
                }
            ]
        )
        .then((result) => {
            resolve(result)
        })
        .catch((err) => {
            reject(err)
        })

    })
}

export const getProductionByProduct = (productId,orgId) => {
    return new Promise((resolve, reject) => {
        orgModel.aggregate(
            [
                {
                    "$match":{
                        "_id":new mongoose.Types.ObjectId(orgId)
                    }
                },
                {
                    "$project":{
                        "containers.production":true
                    }
                },
            ]
        )
        .then((organization) => {
            const production = []
            
            organization[0].containers.forEach((container) => {
                const filteredProduction = container.production.filter((production) => new mongoose.Types.ObjectId(productId).equals(production.ProductID))

                filteredProduction.forEach((prod) => production.push(prod))
            })

            resolve(production)
        })
        .catch(err => {
            reject(err)
        })
    })
}


export const upsertProduction = (productionArray, orgId) => {
    const updateAllElements = productionArray.map(async(productionModel) => {
        console.log(productionModel)
        const update = await orgModel.updateOne(
            {
                "_id": orgId,
            },
            {
                "$set":{
                    "containers.$[].production.$[pr]":productionModel
                }
            },
            {
                arrayFilters:[{"pr._id":productionModel._id}],

            }
        )


        console.log(update)
        return update
    })
    
    return Promise.all(updateAllElements)
}

export const createSingleProductionModelProduct = (orgId, containerId, productionData) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
            { _id: orgId, "containers._id": containerId },
            {
                $push: {
                    "containers.$.production": productionData,
                },
            },
            { new: true }
        )
        .exec()
        .then((org) => {
            if (org) {
                resolve(org);
            } else {
                reject(new Error(JSON.stringify({ message: "Organization or container not found", status: 404 })));
            }
        })
        .catch((err) => {
            reject(new Error(JSON.stringify({ message: "Error updating production", status: 500, processError: err })));
        });
    });
};

export const updateSingleProductionModelProduct = (orgId, containerId, productionData) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
        {
            _id: orgId,
            "containers._id": containerId,
            "containers.production._id": productionData._id
        },
        {
            $set: {
            "containers.$[container].production.$[production]": productionData
            }
        },
        {
            arrayFilters: [
            { "container._id": containerId },
            { "production._id": productionData._id }
            ],
            new: true
        }
        )
        .exec()
        .then((org) => {
            if (org) {
            resolve(org);
            } else {
            reject(new Error(JSON.stringify({ message: "Organization, container, or production not found", status: 404 })));
            }
        })
        .catch((err) => {
            reject(new Error(JSON.stringify({ message: "Error updating production", status: 500, processError: err })));
        });
    });
};
  
export const deleteSingleProductionModelProduct = (orgId, containerId, productionId) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
            { _id: orgId, "containers._id": containerId },
            {
                $pull: {
                    "containers.$.production": { _id: productionId }
                },
            },
            { new: true }
        ).exec()
            .then((org) => {
                if (org) {
                    resolve(org);
                    } else {
                        reject(new Error(JSON.stringify({ message: "Organization, container, or production model(s) not found", status: 404 })));
                    }
                })
            .catch((err) => {
                reject(new Error(JSON.stringify({ message: "Error deleting product of production", status: 500, processError: err })));
            });
    });    
}
