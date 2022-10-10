import {mongoose} from '../../mongo.js'
import { getEmployeeById } from "../employees/store.js"
import Organization from '../../models/organization.js'
import { getMongoQueryByReq } from '../../utils/getMongoQuery.js'
import { getOrganizationById } from '../organization/store.js'
import { getFilteredOrders } from '../orders/store.js'

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
export const calculateTimeEstimation = (orders) => {
    console.log(orders)
    return
}

export const getProductionTotal = (req, res) => {
    return new Promise((resolve, reject) => {
        getFilteredOrders(res.locals.organization, req, false, {key:"status", value:"uncompleted"})
        .then((orders) => {
            resolve(orders)
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