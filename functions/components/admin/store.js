import { mongoose } from '../../mongo.js'
import adminAuth from '../../firebaseAdmin.js'
import User from '../../models/user.js'
import { hashPassphrase, genPassphrase } from './helper.js'
import { newContainer, getContainers } from '../container/store.js'
import { newOrganization, updateOrganization } from '../organization/store.js'

var userModel = mongoose.model('users', User)

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
                .then(containers => {
                    let containerIds = containers.map(cont => cont._id)                    
                    
                    let userModel = new mongoose.model('users', User)

                    let userData = {
                        uid:            userRecord.uid,  
                        email:          data.email,
                        name:           data.name,
                        lname:          data.lname,
                        role:           "employee",
                        containers:     containerIds,
                        customers:      data.customers,
                        admin:          data.admin,
                        organization:   data.organization,
                        address:        data.address,
                        salary:         data.salary || 0,
                        phone:          data.phone
                    }

                    let mongoUser = new userModel(userData)

                    mongoUser.save((e, user) => {
                        if (e) reject(e)
                        
                        // * Update containers field
                        updateContainers(containerIds, {
                            $push: { employees: user._id }
                        })

                        // * Update organization field
                        updateOrganization(data.organization, {
                            $push: { employees: user._id }
                        })

                        resolve(userData)    
                    })
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
            adminAuth.setCustomUserClaims(userRecord.uid, { role: "admin" })
            .then(() => {

                // * Register organization
                //      * It's impoertant to do this step first to avoid 
                //      * any inconsistency and provide proper ObjectIds
                console.log("Role successfully set to: admin")
                newOrganization(data.organization)
                .then(org => {


                    // * Save user on MongoDB
                    let hashedPassphrase = hashPassphrase(data.passphrase != undefined ? data.passphrase : genPassphrase(3))
                    let userModel = new mongoose.model('users', User)
                    
                    let userData = {
                        uid:            userRecord.uid,
                        email:          data.email,
                        name:           data.name,
                        lname:          data.lname,
                        role:           "admin",
                        passphrase:     hashedPassphrase,
                        organization:   org._id,
                        containers:     [],
                        customers:      data.customers,
                        address:        data.address
                    }
    
                    let mongoUser = new userModel(userData)
    
                    mongoUser.save((e, user) => {
                        if (e) reject(e)
                        console.log("error", e)
                        // * Update the owner field in organization
                        updateOrganization(org._id, {
                            $set: { admin: user._id }
                        })

                        // * Register all containers with correct owner
                        Promise.all(data.containers.map(contData => newContainer({
                            ...contData,
                            admin:          user._id,
                            organization:   org._id
                        })))
                        .then(containerIds => {
                            resolve({
                                ...userData,
                                containers: containerIds.map(contRes => contRes._id)
                            })
                        })
                    })
                })
                .catch((error) => {
                    console.log(`Error creating new organization :`, error)
                    reject(error)
                })
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

export function updateUser(id, edit) {

    return userModel.update(id, edit)    
}

export function getUserByFirebaseId(uid) {
    return userModel.findOne({ uid: uid })
}