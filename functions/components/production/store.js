import Organization from '../../models/organization.js'
import { mongoose } from '../../mongo.js'
import { dateToArray, nextDay } from '../../utils/time.js'
import { scheduleTask } from './controller.js'

const orgModel = mongoose.model('organizations', Organization)

export const productionCycleObject = {
    "preSoaking": {
        "next":"soaking1",
        "hasBackGroundTask":false,
    },
    "soaking1":{
        "next":"soaking2",
        "hasBackGroundTask":true,
    },
    "soaking2":{
        "next":"seeding",
        "hasBackGroundTask":true,
    },
    "seeding":{
        "next":"growing",
        "hasBackGroundTask":false
    },
    "growing":{
        "next":"harvestReady",
        "hasBackGroundTask":true,
    },
    "harvestReady":{
        "next":"packing",
        "hasBackGroundTask":false
    }
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
                        "$set":{
                            "containers.$.production.$[prod]":newmodel
                        }
                    },
                    {
                        "arrayFilters":[{"prod._id":mongoose.Types.ObjectId(id)}]
                    }
                )

                const productionStatus = newmodel.ProductionStatus

                if(productionCycleObject[productionStatus].hasBackGroundTask){
                    await scheduleTask({organization:orgId, container, production:newmodel, name:"updateForProduction"})
                }

                return op
            })

            const update = await Promise.all(updateOperation)
            return update
        })
        Promise.all(queryUpdateById)
        .then((result) => resolve(result))
        .catch(err => reject(err))
    })
}

export const getProductionByStatus = (orgId, container, status) => {
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
            resolve(result)
        })
        .catch((err) => {
            reject(err)
        })

    })
}