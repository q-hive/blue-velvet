import {mongoose} from '../../mongo.js'
import { Task } from '../../models/index.js'
import { ObjectId } from 'mongodb'

export const createTask = (obj) => {
    return new Promise((resolve, reject) => {
        obj._id = new ObjectId()
        
        const taskModel = new mongoose.model('tasks', task)

        const taskDoc = new taskModel(obj)

        taskDoc.save((err) => {
            if(err) {
                reject(err)
            }
            resolve()
        })
    })
}

export const generateTasks(product) => {
    return new Promise((resolve, reject) => {
        resolve([])
    })
}

export const getTaskByProdId = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connection.collection('tasks')
        .find({product:[id]})
        .toArray((err, data) => {
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })

}