import Task from '../../models/task.js'
import { getOrgannizationWithAggregation } from '../organization/store.js'

const hasEveryKey = (valid, current) => {
    return valid.every(key => Object.keys(current).includes(key))
}

export const isValidTaskObject = (json) => {
    const validKeys = Object.keys(task.obj)
    validKeys.shift()

    //*Si el objeto tienes la cantidad de llaves que el modelo sin contar el _id, siguiente validacion
    if(!(Object.keys(json).length === Object.keys(task.obj).length-1)){
        console.log("Longitud invalida")
        return false
     }

     if(!hasEveryKey(validKeys, json)) {
        console.log("Las llaves del objeto no tienen el valor correcto")
        return false
     }
     //*Si tiene todos los campos, validar que el formato del valor del campo sea correcto
     return true
}

export const getOrganizationTaskHsitory = (req, res, date, endDate) => {
    return new Promise((resolve, reject) => {
        console.log(new Date(date))
        console.log(new Date(endDate))
        
        let pipelines = [
            {
                $unwind: "$tasksHistory"
            },
            {
                $match: {
                    "tasksHistory.workDay": {
                        $gte: new Date(date),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $project: {
                    "_id": false,
                    "tasksHistory": true,   
                    // "tasksHistory.executedBy": true,
                    // "tasksHistory.expectedTime": true,
                    // "tasksHistory.achievedTime": true,
                    // "tasksHistory.orders": true,
                    // "tasksHistory.taskType": true,
                    // "tasksHistory.taskType": true,
                    // "tasksHistory.workDay": true,
                }
            },
            {
                $group: {
                    "_id": {"organization": "$organization._id"},
                    "tasksHistory": {
                        $push: "$tasksHistory"
                    }    
                }
            }
        ]
        
        getOrgannizationWithAggregation(res.locals.organization, pipelines)
        .then(tasks => {
            if (tasks.length === 0) {
                return resolve(tasks)
            }

            resolve(tasks[0].tasksHistory)     
        })
        .catch(err => {
            reject(err)
        })
    })
}