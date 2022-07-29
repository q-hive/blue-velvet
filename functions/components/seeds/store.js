import mongoose from "mongoose"
import Seed from "../../models/seed.js"

export const createSeed = (seedObj) => {
    return new Promise((resolve, reject) => {
        const seedModel = mongoose.model('seed', Seed)

        const seedDoc = new seedModel(seedObj)

        seedDoc.save((err) => {
            if (err) reject(err)    
            
            resolve(seedDoc)
        })
    })
}