import { mongoose } from '../../mongo.js'
import Passphrase from '../../models/passphrase.js'

import { updateClient } from '../client/store.js'

const passModel = mongoose.model('passphrases', Passphrase)

export const newPassphrase = (data) => {
    return new Promise((resolve, reject) => {
        let mongoPass = new passModel(data)

        mongoPass.save((err, doc) => {
            if (err) reject(err)

            updateClient(data.client, { $set: { passphrase: doc._id } })
            .then(client => resolve(doc))
            .catch(errCli => reject(errCli))
        })
    })
}

export const getPassphrase = (passId) => {
    return new Promise((resolve, reject) => {
        passModel.findOneById(passId ).exec((err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })   
}

export const getPassphraseByUid = (uid) => {
    return new Promise((resolve, reject) => {
        passModel.findOne({ uid: uid }).exec((err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })   
}

export const getPassphraseByClient = (clientId) => {
    return new Promise((resolve, reject) => {
        passModel.findOne({ client: clientId }).exec((err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })   
}

export const updatePassphrase = (passId, edit) => {
    return new Promise((resolve, reject) => {
        passModel.findOneAndUpdate({ _id: passId }, edit, { new: true })
        .exec((err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })
}

export const deletePassphrase = (passId) => {
    return new Promise((resolve, reject) => {
        passModel.deleteOne({ _id: passId }).exec((err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })
}