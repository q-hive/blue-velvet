import Organization from '../../models/organization.js'
import { mongoose } from '../../mongo.js'
import { dateToArray, nextDay } from '../../utils/time.js'
import { updateContainerById } from '../container/store.js'
import { updateOrder } from '../orders/store.js'
import { grouPProductionForWorkDay, scheduleTask } from './controller.js'

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
            "how":"dec"
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
        "hasBackGroundTask":false,
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
export const nextStatusForProduction = (productionModels) => {
    const cycleModel = productionCycleObject

    if(Array.isArray(productionModels)){
        productionModels.forEach((production) => {
            const productionStatus = production.ProductionStatus

            const nextProductionStatus = cycleModel[productionStatus].next

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
            
            
            const nonRepeatedStatus = Array.from(new Set(statusInProductionDB))
    
            if(nonRepeatedStatus.length >1){
                console.log("Production models of " + productionModel.RelatedOrder + " order must all have the same status before updating order status")
    
                return
            }
    
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

export const updateManyProductionModels = (orgId,container,productionIds) => {
    return new Promise((resolve, reject) => {
        console.log("Updating production models")
        
        const queryUpdateById = productionIds.map(async (id) => {
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
            
            let filteredProductionModels = []
            
            productionModel.containers.forEach((container) => {
                const productionModelFound = container.production.find((production) => production._id.equals(id))

                filteredProductionModels.push(productionModelFound)
            })

            const modifiedModels = nextStatusForProduction(filteredProductionModels)
            const updateOperation = modifiedModels.map(async (newmodel) => {
                const op = await orgModel.updateOne(
                    {
                        "_id":mongoose.Types.ObjectId(orgId),
                        "ocntainers":{
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
                        "$set":{
                            "containers.$.production.$[prod]":newmodel
                        }
                    },
                    {
                        "arrayFilters":[{"prod._id":mongoose.Types.ObjectId(id)}]
                    }
                )

                const productionStatus = newmodel.ProductionStatus

                if(productionCycleObject[productionStatus]?.hasBackGroundTask){
                    await scheduleTask({organization:orgId, container, production:newmodel, name:"updateForProduction"})
                }

                if(productionCycleObject[productionStatus]?.affectsCapacity.affect){

                    console.log("El container must be updated")
                    await updateContainerById(orgId, container, {query:"add",key:"available", value:-(Math.ceil(newmodel.trays))})
                }

                return op
            })

            const update = await Promise.all(updateOperation)
            await updateOrdersInModels(modifiedModels, orgId, container)

            return update
        })
        Promise.all(queryUpdateById)
        .then((result) => resolve(result))
        .catch(err => reject(err))
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
            // const grouppedProd = grouPProductionForWorkDay("status",result[0].containers.production, "hash")

            const grouppedProd = result.map((docPerProduction) => {
                return docPerProduction.containers.production
            })
            
            
            resolve(grouppedProd)
        })
        .catch((err) => {
            reject(err)
        })

    })
}