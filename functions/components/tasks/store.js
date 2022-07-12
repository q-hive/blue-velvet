import {mongoose} from '../../mongo.js'

export const getTaskByProdId = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connection.collection('tasks')
        .find({product:id})
        .toArray((err, data) => {
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })

}