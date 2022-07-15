import mongoose from '../../mongo.js'
import Container from '../../models/container.js'

export const newContainer = (contData) => {
    return new Promise((resolve, reject) => {
        let containerModel = new mongoose.model('containers', Container)

        let containerMapped = {
            name:           String,
            admin:          ObjectId,
            organization:   ObjectId,
            capacity:       Number, // * Measured in trays
            organization:   ObjectId,
            employees:      [ObjectId],
            prodLines:      [ObjectId],
            address: {
                stNumber:   String,
                street:     String,
                zip:        String,
                city:       String,
                state:      String,
                country:    String,
                references: String
            },
            products: [{
                _id:    ObjectId,
                trays:  Number
            }],
            location: {
                latitude:   Number,
                longitude:  Number
            }
        }

        let containerDoc = containerModel(contData)

        containerDoc.save((e, cont) => {
            if (e) {
                reject(e)
            }
            resolve(cont.id)
        })
    })    
}