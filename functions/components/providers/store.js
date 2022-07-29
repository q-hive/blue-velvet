import mongoose from "mongoose"
import Provider from "../../models/provider.js"

export const createProvider = (obj) => {
    return new Promise((resolve, reject) => {
        const providerModel = mongoose.model('provider', Provider)

        const provDoc = new providerModel(obj)

        provDoc.save((err) => {
            if(err) reject(err)

            resolve(provDoc)
        })
    })

}