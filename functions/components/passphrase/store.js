import { mongoose } from '../../mongo.js'
import { ObjectId } from mongoose.Types
import { Passphrase } from '../../models/index.js'

import { updateClient } from '../client'

const passModel = mongoose.model('passphrases', Passphrase)

export const newPassphrase = (data) => {
    return new Promise((resolve, reject) => {
        let mongoPass = new passModel(data)

        mongoPass.save((err, doc) => {
            if (err) reject(err)

            updateClient(data.clien, {
                $set: { passphrase: doc._id }
            })

            resolve(doc)
        })
    })
}