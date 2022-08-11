import { getOrganizationById } from "../organization/store.js"

export const newSeed = (orgId, provId, seedObj) => {
    return new Promise((resolve, reject) => {
        
        getOrganizationById(orgId)
        .then(org => {
            org.providers.findOne(provId).exec()
            .then(prov => {
                prov.seeds.push(seedObj)

                org.save((err, doc) => {
                    if (err) reject(err)

                    resolve(seedObj)
                })
            })
        })

    })
}

export const getSeedsByProvider = (orgId, provId) => {
    getOrganizationById(orgId)
    .then(org => {
        org.providers.findOneById(provId).exec((err, doc) => {
            if (err) reject(err)
            resolve(doc.seeds)
        })
    })
}
export const getSeedsByOrg = (orgId) => {
    let seedMap = {}

    getOrganizationById(orgId)
    .then(org => {
        
        // * Save seeds by provider id
        org.providers.forEach(prov => {
            seedMap[prov._id] = prov.seeds
        })
        
        resolve(seedMap)
    })
}
export const getSeed = (orgId, provId, seedId) => {
    getOrganizationById(orgId)
    .then(org => {
        org.providers.findOneById(provId).exec()
        .then(prov => {
            prov.seeds.findOneById(seedId).exec((err, doc) => {
                if (err) reject(err)
                resolve(doc)
            })
        })
    })
}

export const updateSeed = (orgId, provId, seedId, edit) => {
    return new Promise((resolve, reject) => {

        getOrganizationById(orgId)
        .then(org => {
            org.providers.findOneById(provId).exec()
            .then(prov => {
                prov.seeds.findOneAndUpdate({ _id: seedId }, edit, { new: true })
                .exec((err, doc) => {
                    if (err) reject(err)
                    resolve(doc)
                })
            })
        })

    })
}

export const deleteSeed = (orgId, provId, seedId) => {}
