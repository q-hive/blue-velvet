import { mongoose } from '../../mongo.js'
let { ObjectId } = mongoose.Types

import adminAuth from '../../firebaseAdmin.js'

import { hashPassphrase, genPassphrase, rollBackClient } from './helper.js'
import { getOrganizationById, newOrganization, deleteOrganization } from '../organization/store.js'
import { newPassphrase, deletePassphrase } from '../passphrase/store.js'
import { newClient } from '../client/store.js'
import { getPassphraseByUid } from '../security/controller.js'


export function newEmployee(res,data) {
    return new Promise((resolve, reject) => {
        // * Create account on firebase
        adminAuth.createUser({
            email:          data.email,
            emailVerified:  false,
            password:       data.password,
            displayName:    data.name + " " + data.lname,
            photoURL:       data.image,
            disabled:       false,
        })
        .then(userRecord => {
            
            console.log('Successfully created new user on firebase:', userRecord.uid);
            
            // * Update role and organization to employee in custom claims
            adminAuth.setCustomUserClaims(userRecord.uid, { 
                role:           "employee",
                organization:   res.locals.organization 
            })

            getOrganizationById(res.locals.organization)
            .then(org => {

                let empData = {
                    uid:            userRecord.uid,  
                    email:          data.email,
                    name:           data.name,
                    lname:          data.lname,
                    phone:          data.phone,
                    image:          data.image,
                    salary:         data.salary,
                    address:        data.address
                }

                // * Add employee to record
                org.employees.push(empData)

                org.save((err, doc) => {
                    if (err) reject(err)

                    resolve(doc)
                })
            })
        })
        .catch(err => {
            console.log('Error creating new employee account on firebaseAtuh:', err)
            reject(err)
        })

    })
}

export function newAdmin(data) {
    return new Promise((resolve, reject) => {
        // * Create account on firebase
        adminAuth.createUser({
            email: data.email,
            emailVerified: false,
            password: data.password,
            displayName: data.name + " " + data.lname,
            photoURL: data.image,
            disabled: false,
        })
        .then(userRecord => {
            console.log('Successfully created new client account on firebase:', userRecord.uid);
            // * Generate ObjectId for client document
            let clientId = new ObjectId()
            let orgId =    new ObjectId()
            let passId =   new ObjectId()
            
            .// * Update customUserClaims
            adminAuth.setCustomUserClaims(userRecord.uid, { role: "admin", organization: org._id })
                    
            // * Generate hashed passphrase mongo record
            let hashedPassphrase = hashPassphrase(data.passphrase !== undefined ? data.passphrase : genPassphrase(3))
            
            let passData = {
                _id:            passId,
                client:         clientId,
                uid:            userRecord.uid,
                passphrase:     hashedPassphrase,
                organization:   org._id
            }

            newPassphrase(passData)
            .then(pass => {
                let clientData = {
                    _id:                clientId,
                    uid:                userRecord.uid,
                    email:              data.email,
                    passphrase:         pass._id,
                    organization:       orgId,
                    name:               data.name,
                    lname:              data.lname,
                    phone:              data.phone,
                    image:              data.image,
                    businessName:       data.organization.name,
                    socialInsurance:    data.socialInsurance,
                    bankAccount:        data.bankAccount,
                    address:            org.address
                }

                newClient(clientData)
                .then(client => {
                    // * Register organization
                    // * It's impoertant to do this step first to avoid 
                    // * any inconsistency and provide proper ObjectIds
                    let orgData = {
                        _id:    orgId,
                        owner:  clientId,
                        ...data.organization
                    }
                    
                    newOrganization(orgData)
                    .then(org => {
                        
                        resolve({
                            client: client,
                            organization: org,
                            passphrase: pass
                        })
                    })
                    .catch(err => {
                        console.log('Error creating new organization on MongoDB:', err)
                        // * Delete account from firebase as rollback
                        adminAuth.deleteUser(userRecord.uid)
                        reject(err)
                    })
                })
                .catch(err => {
                    console.log('Error creating new client on MongoDB:', err)
                    // * Delete account from firebase as rollback
                    adminAuth.deleteUser(userRecord.uid)
                    reject(err)
                })
            })
            .catch(err => {
                console.log('Error creating new passphrase on MongoDB:', err)
                // * Delete account from firebase as rollback
                rollBackClient()
                adminAuth.deleteUser(userRecord.uid)
                reject(err)
            })  
        })
        .catch(err => {
            console.log('Error creating new admin user on firebaseAtuh:', err)
            reject(err)
        })
    })
}

export const updateUser = () => {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

export const deleteClient = (clientId, options) => {
    return new Promise((resolve, reject) => {
        // * Delete the client with all of the records related to him by default
        // * Except if it's specified in the "options" object

        // * All required delete operations are to be pushed into
        // * 'deleteOperations' which then will be passed onto a
        // * Promise.all() to wait for the delete operations
        
        // * Obtain client data for relation
        getClient(clientId)
        .then(client => {

            let deleteOperations = []
    
    
            // * 1 - Delete organization
            if (!options.organization) {
                deleteOperations.push(new Promise((resolve, reject) => {
                    deleteOrganization(client.organization)
                    .then(org => {
                        resolve(org)
                    })
                    .catch(err => reject(err))
                }))
            }
            // * 2 - Delete passphrase
            if (!options.pass) {
                deleteOperations.push(new Promise((resolve, reject) => {
                    deletePassphrase(client.passphrase)
                    .then(passphrase => {
                        resolve(passphrase)
                    })
                    .catch(err => reject(err))
                }))
            }
            // * 3 - Delete Client FirebaseAuth account
            if (!options.auth) {
                deleteOperations.push(new Promise((resolve, reject) => {
                    
                }))
            }
            // * 4 - Delete client register
            if (!options.client) {
                deleteOperations.push(new Promise((resolve, reject) => {
                    getPassphraseByUid(clientId)
                    .then(org => {
                        deletePassphrase(org._id)
                        .then(orgDoc => {
                            resolve(orgDoc)
                        })
                        .catch(err => reject(err))
                    })
                    .catch(err => reject(err))
                }))
            }
            
        })
        .catch(err => reject(err))
    }) 
}

export const deleteEmployee = () => {
    return new Promise((resolve, reject) => {
        resolve()
    }) 
}