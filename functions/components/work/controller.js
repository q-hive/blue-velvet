import {mongoose} from '../../mongo.js'
import Organization from '../../models/organization.js'

import { getMongoQueryByObject } from '../../utils/getMongoQuery.js'

import { updateOrder } from '../orders/store.js'
import { getProductById, updateProduct } from '../products/store.js'
import { getProductionInContainer } from '../production/store.js'

import { getProductionWorkByContainerId, grouPProductionForAnalytics, grouPProductionForWorkDay } from '../production/controller.js'
import { updateEmployee } from '../employees/store.js'

const orgModel = mongoose.model('organization', Organization)

/**
 *
 * @param {*} array
 * @description Receives an array of objects, each object represents a performance key that contains the value
 */
export const setPerformance = (orgId, id, array) => {
    return new Promise((resolve, reject) => {
        const queries = array.map(async (queryConfig) => {
            const dbOp = await orgModel.updateOne(
                {_id:mongoose.Types.ObjectId(orgId), "employees._id":mongoose.Types.ObjectId(id)},
                {"$set":{[`employees.$.performance.${Object.keys(queryConfig)[1]}`]:Object.entries(queryConfig)[1][1]}}
            )

            return dbOp
        })
        Promise.all(queries)
        .then(results => {
            resolve(results)
        })
        .catch(err => {
            reject(err)
        })
    })
}


export const updatePerformance = (orgId, id, array) => {
    return new Promise((resolve, reject) => {

        const queries = array.map(async (queryConfig) => {
            console.log(`${getMongoQueryByObject(queryConfig)} employees.$.performance.${Object.keys(queryConfig)[1]}: ${typeof Object.entries(queryConfig)[1][1]}`)
            
            const dbOp = await orgModel.updateOne(
                {
                    "_id":mongoose.Types.ObjectId(orgId), 
                    "employees._id":mongoose.Types.ObjectId(id)},
                {
                    [`${getMongoQueryByObject(queryConfig)}`]: {
                        [`employees.$.performance.${Object.keys(queryConfig)[1]}`]:Object.entries(queryConfig)[1][1],
                    }
                }
            )

            return dbOp
        })

        Promise.all(queries)
        .then(results => {
            resolve(results)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const updateWorkDayForEmployee = (req, res, isTask, paramOfTask = undefined) => {
    return new Promise(async (resolve, reject) => {
        if(isTask){
            console.log("Task will be updated in employee workday")
            await updatePerformance(res.locals.organization, req.body.executedBy, [{query:"set", allocationRatio:1}])

            const result = await updateEmployee(res.locals.organization,req.body.executedBy,{"workDayTask":{"type":req.body.taskType,"value":{[paramOfTask]:req.body[paramOfTask]}}})
            resolve(result)
            return
        }

        req.query.containerId = req.params.containerId
        let production = {}
        let productionAnalytics = {}
        if(req.query.delete === undefined){
            production = await getProductionWorkByContainerId(req, res, "employee")

            productionAnalytics = grouPProductionForAnalytics("tasks", production, "hash")
        }

        try {
           const result =  await updateEmployee(res.locals.organization,req.params.employeeId,{"workDay":productionAnalytics})
           console.log(result)
           
        } catch (err) {
            reject(err)
        }
        
        resolve("Updated")
    })
}

export const statusRequiredParameters = () => {
    return {
        "preSoaking":   "trays",
        "seeding":      "trays",
        "growing":      "trays",
        "harvestReady": "trays",
        "ready":        "trays",
        "packing":      "trays"
    }
}
export const calculateTimeEstimation = (totalProduction, isGroupped = false) => {
    //*TIMES PER TRAY in minutes
    const estimatedTimes = {
        "preSoaking":   5,
        "seeding":      2.2,
        "growing":      0,
        "harvestReady": 2,
        "ready":        3,
        "packing":      2,
        "delivery":     3
    }

    let productionGroupedByStatus
    if(isGroupped) {
        productionGroupedByStatus = totalProduction    
    } else {
        productionGroupedByStatus = grouPProductionForWorkDay("status",totalProduction, "array", false, false)
    }

    const parametersByStatus = statusRequiredParameters()
    
    
    const totals = productionGroupedByStatus.map((productionModel) => {
        const total = productionModel[Object.keys(productionModel)[0]].reduce((previous, current) => {

            const previousRequiredParameterTotal = previous[parametersByStatus[Object.keys(productionModel)[0]]]
            const currentRequiredParameterTotal = current[parametersByStatus[Object.keys(productionModel)[0]]]
            
            return {[parametersByStatus[Object.keys(productionModel)[0]]]:previousRequiredParameterTotal + currentRequiredParameterTotal}
        },{
            [parametersByStatus[Object.keys(productionModel)[0]]]:0,
        })

        console.log(total)
        return {[`${Object.keys(productionModel)[0]}`]:{"minutes":Number((((total[parametersByStatus[Object.keys(productionModel)[0]]]*estimatedTimes[Object.keys(productionModel)[0]])*60)*1000).toFixed(2))}} 
    })

    
    return totals
}


const insertOrdersInProduction = (production, orders) => {
    production.orders = []

    const prodMatchedOrders = orders.filter((order) => {
        return order.productionData.find((produc) => produc.id.equals(production.prodId))
    })

    let mappedMatchedOrders = prodMatchedOrders.forEach((matchedOrder) => {
        production.orders.push(matchedOrder._id)    
    })

    return production
}

export const getWorkTimeByEmployee = (req, res) => {
    return new Promise((resolve, reject) => {
        getProductionInContainer(res.locals.organization,req.query.containerId)
        .then(async (production) => {
            const totalEstimations = calculateTimeEstimation(production)
            
            resolve(totalEstimations)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

export const getProductionWorkById = (req,res) => {
    return new Promise((resolve, reject) => {
        getProductionTotal(req, res)
        .then(production => {
            resolve(production)
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

export const parseProduction = (req,res,work) => {
    return new Promise((resolve, reject) => {
        const asyncMapWork = work.map(async (totalWork) => {
            const productData = await getProductById(res.locals.organization,req.query.container, totalWork.prodId)
            const newProductModel = {
                "trays":    totalWork.trays,
                "harvest":  totalWork.harvest,
                "seeds":    totalWork.seeds,
                "name":     productData.name,
                "status":   productData.status,
                "mix":      productData.mix.isMix,
                "prodId":   totalWork.prodId,
                "orders":   totalWork.orders
            }
            return { 
                productData: newProductModel
            }
            
        }) 
        Promise.all(asyncMapWork)
        .then((mappedWork) => {
            let finalModel = {
                production: {
                   products: mappedWork
                }
            }
            
            resolve(finalModel)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const buildTaskFromProductionAccumulated = (taskName, production) => {
    console.log("Building " + taskName + " task for production data")

    let time = calculateTimeEstimation(production, false)

    time = time.find((taskTimeObj) => {
        return Object.keys(taskTimeObj)[0] === taskName
    })

    const allModelsIds = production.flatMap((productionModel) => {
        return productionModel?.modelsId 
    })

    
    let task = {
        [taskName]: {
            expectedTime:time[taskName].minutes,
            modelsIds:allModelsIds,
            achievedTime:0 
        }
    }

    //*GROUP ALL PRODUCTION MODEL IDS BY TASK
    //*DETERMINE EXPECTED TIME FROM SEEDS, HARVEST AND TRAYS
    //*SET ACHIEVED TIME IN 0

    return task
}

export const updateOrgTasksHistory = (orgId, taskModel) => {
    return new Promise( async (resolve, reject) => {
        let mappedTaskModel
            
        try {

            mappedTaskModel = {
                executedBy:    mongoose.Types.ObjectId(taskModel.executedBy),
                expectedTime:  Number(taskModel.expectedTime),
                achievedTime:  Number(taskModel.achievedTime),    
                orders:        taskModel.orders.map((orderId) => mongoose.Types.ObjectId(orderId)),
                taskType:      taskModel.taskType,
                workDay:       taskModel.workDay
            }

            // const mongooseTaskModel = mongoose.model('task', mappedTaskModel)
            const query = await orgModel.findOneAndUpdate(
                {
                    "_id": mongoose.Types.ObjectId(orgId)
                },
                {
                    "$push": {
                        "tasksHistory": mappedTaskModel
                    }
                }, 
                {
                    "upsert":true,
                }
            ).exec()

            resolve(query)
        } catch (err) {
            reject(err)
        }
    })
}