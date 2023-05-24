import { mongoose } from '../../mongo.js'
let { ObjectId } = mongoose.Types
import Passphrase from '../../models/passphrase.js'

import { updateClient } from '../client/store.js'

const passModel = mongoose.model('passphrases', Passphrase)

export const newPassphrase = (data) => {
    return new Promise((resolve, reject) => {
        let mongoPass = new passModel(data)

        mongoPass.save((err, doc) => {
            if (err) reject(err)

            updateClient(data.client, {
                $set: { passphrase: doc._id }
            })

            resolve(doc)
        })
    })
}

export const deletePassphrase = (clientId) => {
    return new Promise((resolve, reject) => {
        passModel.findOneAndRemove({ "client": clientId }, (err, doc) => {
            if (err) reject(err);
            if (!doc) {
                reject(new Error(JSON.stringify({message:"Passphrase does not exist", status:409})))
            } else {
                resolve(doc);
            }
        });        
    });
}
