import {mongoose} from '../../mongo.js'
import { getEmployeeById } from "../employees/store.js"
import Organization from '../../models/organization.js'
import { getMongoQueryByObject } from '../../utils/getMongoQuery.js'
import { getOrganizationById } from '../organization/store.js'
import { getFilteredOrders, updateOrder } from '../orders/store.js'
import { getProductById, updateProduct } from '../products/store.js'
import axios from 'axios'
import nodeCron from 'node-cron'
import Task from '../../models/task.js'

const orgModel = mongoose.model('organization', Organization)

// export const updateProduct = async (options) => {
//     const request = await axios[`${options.requestConfig.method}`](`http://localhost:9999${options.requestConfig.path}`,
//     {   
//         data:options.data
//     },
//     {
//         headers:options.requestConfig.headers
//     }
//     )
//     return request
// }

export const setupGrowing = (workData) => {
    const growingSetup = workData.map((productionObj) => {
        console.log(productionObj)
        const lightTime = productionObj.productData.day
        const darkTime = productionObj.productData.night
        
        const triggerHarvestTime = Date.now() + (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))

        console.log(`The product -> ${productionObj.productData.name} needs a total time of ${darkTime + lightTime} days to grow. scheduling monitoring task...`)
        const triggerParsedDate = new Date(triggerHarvestTime)
        triggerParsedDate.setHours(4,0,0)

        return {_id:productionObj.productData.prodId, name:productionObj.productData.name, harvest:productionObj.productData.harvest, orders:productionObj.productData.orders, date:triggerParsedDate, workData:{...productionObj}}
    })
    
    return growingSetup
}

export const scheduleTask = (config) => {
    console.log(`The ${config.name} update will be executed on: ${new Date(config.scheduleInDate)}`)

    return nodeCron.schedule(`0 ${new Date(config.scheduleInDate).getHours()} ${new Date(config.scheduleInDate).getDate()} ${new Date(config.scheduleInDate).getMonth()} ${new Date(config.scheduleInDate).getDay()}`, () => config.task(config))
    
    // setTimeout(() => {
        
    // }, 1000)

}

export const startGrowing = (config) => {
    return new Promise((resolve, reject) => {
        try{
                config.growingSetup.map((products) => {
                    const scheduledTask = scheduleTask(
                        {
                            ...products,
                            scheduleInMs:products.date.getTime() - Date.now(),
                            scheduleInDate: products.date,
                            task:() => updateProductionByStatus(config.status, config.organization, config.production).then(() => console.log("Completed")).catch(() => console.log("Failed"))
                        }
                    )
                    return scheduledTask
                })
        } catch (err) {
            reject(err)
        }
    })
}


export const updateProductionByStatus = (status, organization, production) => {
    return new Promise((resolve, reject) => {
        const flatOrders = production.flatMap((prodData) => prodData.productData.orders)
        const nonRepeatedOrders = Array.from(new Set(flatOrders))

        const updateOrdersbyMapping = nonRepeatedOrders.map(async (order) => {
            const result = await updateOrder(organization, order, {
                paths: [{path:"status", value:status}]
            })
            return result
        })
        
        const updateProductsByMapping = production.map(async(productionData, index) => {
            await updateProduct(organization, productionData.productData.prodId, "status", status)
            const completeProdObj = await getProductById(organization, "633b2e0cd069d81c46a18033", productionData.productData.prodId)
            return {...productionData, productData: {...productionData.productData, ...completeProdObj.parameters}}
        })



        Promise.all(updateOrdersbyMapping)
        Promise.all(updateProductsByMapping)
        .then((result) => {
            if(status === "growing"){
                console.log("Starting schedule job...")
                const growingSetup = setupGrowing(result)
                startGrowing({ organization, status:"harvestReady", production, growingSetup})
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                })
            }
            
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
    
}
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
export const calculateTimeEstimation = (totalProduction) => {
    //*TIMES PER TRAY in minutes
    const harvest = 2;
    const packing25 = 0.48;
    const packing80 = 0.5;
    const seeding = 2.2;

    return totalProduction.map((production) => {
        production.times = {
            harvest: {
                totalAmount: production.harvest,
                time: harvest * production.trays
            }
        }

        production.times.seeding = {
            totalAmount: production.seeds,
            time: seeding * production.trays
        }
        return {...production}
    })
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
export const getProductionTotal = (req, res) => {
    return new Promise((resolve, reject) => {
        req.query.production = "true"
        
        const origin = req.path

        let matchOrders = false;    
        
        if(origin.split('/').includes("production")){
            matchOrders = true;
        }
        getFilteredOrders(res.locals.organization, req, true, {key:"status", value:"uncompleted"})
        .then((orders) => {
            try {
                let productionData = orders.flatMap((order) => {
                    return order.productionData
                })

                const ids = productionData.map((productData) => {
                    return productData.id
                })

            
                const filtered = [];

                for(const id of ids){
                    let isNew = true;
                    for(const elem of filtered){
                        if(id.equals(elem)){
                            isNew = false
                        }
                    }

                    if(isNew){
                        filtered.push(id)
                    }
                }

                const accumProduction = []
                for(const id of filtered) {
                    const filteredProduction = productionData.filter((prddata) => prddata.id.equals(id))
                    console.log(filteredProduction)
                    let productionById = filteredProduction.reduce((prev, curr) => {
                        return {
                            "seeds": prev.seeds + curr.seeds,
                            "harvest": prev.harvest + curr.harvest,
                            "trays": prev.trays + curr.trays,
                            "prodId":id,
                            "status":prev.status
                        }
                    }, {seeds:0, harvest:0, trays:0, id:undefined, status:undefined})

                    if(matchOrders){
                        productionById = insertOrdersInProduction(productionById, orders)
                    }

                    accumProduction.push(productionById)
                }


                resolve(accumProduction)
            } catch(err) {
                reject(err)
            }
        })
        .catch(err => {
            reject(err)
        })
    })
}


export const getWorkTimeByEmployee = (req, res) => {
    return new Promise((resolve, reject) => {
        getProductionTotal(req, res)
        .then((production) => {
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

            const updateEmployeePerformance = await updatePerformance(orgId, taskModel.executedBy, [{query:"set", allocationRatio:""}])
            
            resolve(query)
        } catch (err) {
            reject(err)
        }
    })
}