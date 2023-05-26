import {mongoose} from '../../mongo.js'
import Organization from '../../models/organization.js'
import Task from '../../models/task.js'
import { ObjectId } from 'mongodb'
import TaskDetails from '../../models/taskDetails.js'

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

        const orders  = org.orders

        if(!orders) {
            return reject("No orders found")
        }

        const taskByProd = orders.map((order) => {
            const status = order.status !== "delivered"
            const hasTheProduct = order.products.find((prod) => prod._id.equals(id))
            if(status && (hasTheProduct !== undefined && hasTheProduct !== null)){
                return order
            }
        })
        let count = 0
        const indexes = []
        taskByProd.forEach((task, idx) => {
            if(task === undefined || task === null){
                count++
                indexes.push(idx)
            }
        })
        
        taskByProd.splice(indexes[0], indexes.length)
        
        resolve(taskByProd.length)
        
    })

}

export const insertManyTasks = (array) => {
    return new Promise((resolve, reject) => {
        const taskModel = mongoose.model("TasksDetails", TaskDetails)
        console.log(array)
        taskModel.insertMany(array, (err, data) =>{
            if(err) return reject(err)

            return resolve(data)
        })
    })

}