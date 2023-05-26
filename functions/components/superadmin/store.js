import { mongoose } from '../../mongo.js'
import SuperAdmin from '../../models/superadmin.js'

const superAdminModel = mongoose.model('superadmins', SuperAdmin)

export const newClientSuperAdmin = (data) => {
    return new Promise((resolve, reject) => {
        let superAdminDoc = new superAdminModel(data)

        superAdminDoc.save((err, doc) => {
            if (err) reject(err)

            resolve(doc)
        })
    })
}