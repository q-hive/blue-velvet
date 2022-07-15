import mongoose from '../../mongo.js'
import adminAuth from '../../firebaseAdmin.js'
import User from '../../models/user.js'
import Container from '../../models/container.js'
import Organization from '../../models/organization.js'
import { hashPassphrase, genPassphrase } from './helper.js'
import { newContainer } from '../container/store.js°'

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
            // * Update role to admin in custom claims
            adminAuth.setCustomUserClaims(userRecord.uid, { role: "employee" })
            .then(() => {

                // * Register organization
                //      * It's impoertant to do this step first to avoid 
                //      * any inconsistency and provide proper ObjectIds

                let orgModel = new mongoose.model('organizations', Organization)

                newOrganization(orgData)
                .then(_id => {
                    
                })


                let userModel = new mongoose.model('users', User)
                
                // * Obtain container ids 

                let containerIds = data.containers === undefined 
                                || data.containers === [] 
                                || data.containers === {} 
                    ? Container.byOrganization()

                let userData = {
                    email:      data.email,
                    name:       data.name,
                    lname:      data.lname,
                    role:       "employee",
                    containers: containersIds,
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