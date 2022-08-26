import mongoose from "mongoose"
import Provider from "../../models/provider.js"

export const newProvider = (orgId, prov) => {
    return new Promise((resolve, reject) => {
        getOrganizationById(orgId)
        .then(org => {
            org.providers.push(prov)
            org.save((err, doc) => {
                if (err) reject(err)
                resolve(doc)  
            })
        })
    })
}

export const getProviderByName = async (orgId, provName) => {
    return new Promise(async (resolve, reject) => {
        getOrganizationById(orgId)
        .then(org => {
            org.providers.findOne({ name: provName }).exec((err, doc) => {
                if (err) reject(err)
                resolve(doc)  
            })
        })
    })
}

export const getProviderById = (orgId, provId) => {
    return new Promise((resolve, reject) => {
        getOrganizationById(orgId)
        .then(org => {
            org.providers.findOneById(provId).exec((err, doc) => {
                if (err) reject(err)
                resolve(doc)  
            })
        })
    })
}