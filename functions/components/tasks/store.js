import {mongoose} from '../../mongo.js'
import Organization from '../../models/organization.js'
import Task from '../../models/task.js'
import { ObjectId } from 'mongodb'

export const createTask = (obj) => {
    return new Promise((resolve, reject) => {
        obj._id = new ObjectId()
        
        const taskModel = new mongoose.model('tasks', Task)

        const taskDoc = new taskModel(obj)

        taskDoc.save((err) => {
            if(err) {
                reject(err)
            }
            resolve()
        })
    })
}

export const generateTasks = (product) => {
    return new Promise((resolve, reject) => {
        resolve([])
    })
}

export const getTaskByProdId = (orgId, id) => {
    return new Promise(async (resolve, reject) => {
        const orgModel = mongoose.model('organizations', Organization)
        
        const org = await orgModel.findById(orgId)
        if(!org){
            return reject("No org found")
        }

        const cont  = org.containers

        if(!cont) {
            return reject("No containers found")
        }

        const prodLine = cont[0].production
        
        if(!prodLine || prodLine.length === 0) {
            return resolve(prodLine)
        }

        const taskByProd  = prodLine.tasks.id(id)

        resolve(taskByProd)

    })

}