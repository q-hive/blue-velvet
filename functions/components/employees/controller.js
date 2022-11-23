import { getEmployeesWithAggregation } from "./store.js"

export const getEmployeesPerformance = (orgId) => {
    return new Promise((resolve, reject) => {
        const performanceAggregationModel = {
            "employees":{
                "name":true,
                "performance":true,
                "_id":true
            }
        }
        
        getEmployeesWithAggregation(orgId,performanceAggregationModel)
        .then((result) => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}