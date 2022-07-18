import { mongoose } from '../../mongo.js'
import adminAuth from '../../firebaseAdmin.js'
import User from '../../models/user.js'
import { hashPassphrase, genPassphrase } from './helper.js'
import { newContainer, getContainers } from '../container/store.js'
import { newOrganization } from '../organization/store.js'

export function newEmployee(data) {
    return new Promise((resolve, reject) => {
        // * Create account on firebase
        adminAuth.createUser({
            email: data.email,
            emailVerified: false,
            phoneNumber: data.phone,
            password: data.password,
            displayName: data.name + " " + data.lname,
            photoURL: data.image,
            disabled: false,
        })
        .then((userRecord) => {
            console.log('Successfully created new user on firebase:', userRecord.uid);
            // * Update role to employee in custom claims
            adminAuth.setCustomUserClaims(userRecord.uid, { role: "employee" })
            .then(() => {
                getContainers({ 
                    organization:   data.organization,
                    admin:          data.admin
                })
                .then(containersIds => {
                    let userModel = new mongoose.model('users', User)

                    let userData = {
                        email:          data.email,
                        name:           data.name,
                        lname:          data.lname,
                        role:           "employee",
                        containers:     containersIds,
                        customers:      data.customers,
                        admin:          data.admin,
                        organization:   data.organization,
                        address:        data.address,
                        salary:         data.salary || 0,
                        phone:          data.phone
                    }

                    let mongoUser = new userModel(userData)

                    mongoUser.save((e) => {
                        console.error()
                        reject(e)
                    })

                    resolve(userData)
                })
                
                
            })
        })

    })
}

export function newAdminAccount(data) {
    return new Promise((resolve, reject) => {
        // * Create account on firebase
        adminAuth.createUser({
            email: data.email,
            emailVerified: false,
            phoneNumber: data.phone,
            password: data.password,
            displayName: data.name + " " + data.lname,
            photoURL: data.image,
            disabled: false,
        })
        .then((userRecord) => {
            console.log('Successfully created new user on firebase:', userRecord.uid);
            // * Update role to admin in custom claims
            adminAuth.setCustomUserClaims(userRecord.uid, {role: "admin"})
            .then(() => {

                // * Register organization
                //      * It's impoertant to do this step first to avoid 
                //      * any inconsistency and provide proper ObjectIds
                newOrganization(data.organization)
                .then(org => {

                })

                let orgData = {
                    name: data.organization.name,
                    owner: orgData.owner,
                    address: orgData.address
                    
                }

                newOrganization(orgData)
                .then(_id => {admin 
                    
                })

                let containerIds = []

                data.containers.forEach(cont => {
                    newContainer(cont)
                    .then(contId => {
                        containerIds.push(contId)
                    })
                })
                
                let passphrase = hashPassphrase(data.passphrase || genPassphrase())
                let userModel = new mongoose.model('users', User)
                
                let userData = {
                    email:      data.email,
                    name:       data.name,
                    lname:      data.lname,
                    role:       "admin",
                    passphrase: passphrase,
                    containers: containerIds,
                    customers:  data.customers,
                    address:    data.address
                }

                let mongoUser = new userModel(userData)

                mongoUser.save((e) => {
                    console.error()
                    reject(e)
                })

                resolve(userData)
            })
            .catch((error) => {
                console.log(`Error assigning new admin role on ${userRecord.email}:`, error)
                reject(error)
            })
        })
        .catch((error) => {
            console.log('Error creating new admin user on firebaseAtuh:', error)
            reject(error)
        })
    })
}