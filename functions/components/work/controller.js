import {mongoose} from '../../mongo.js'
import { getEmployeeById } from "../employees/store.js"
import Organization from '../../models/organization.js'
import { getMongoQueryByReq } from '../../utils/getMongoQuery.js'
import { getOrganizationById } from '../organization/store.js'
import { getFilteredOrders } from '../orders/store.js'
import { getProductById } from '../products/store.js'

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
                {_id:orgId, "employees._id":id},
                {$set:{[`employees.$.performance.${Object.keys(queryConfig)[1]}`]:Object.entries(queryConfig)[1][1]}}
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
            const dbOp = await orgModel.updateOne(
                {_id:orgId, "employees._id":id},
                {
                    [`${getMongoQueryByReq(queryConfig)}`]: {
                        [`employees.$.performance.${Object.keys(queryConfig)[1]}`]:Object.entries(queryConfig)[1][1],
                        "employees.$.performance.updated":"$$NOW"
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

                    let productionById = filteredProduction.reduce((prev, curr) => {
                        return {
                            "seeds": prev.seeds + curr.seeds,
                            "harvest": prev.harvest + curr.harvest,
                            "trays": prev.trays + curr.trays,
                            "prodId":id,
                        }
                    }, {seeds:0, harvest:0, trays:0, id:undefined})

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