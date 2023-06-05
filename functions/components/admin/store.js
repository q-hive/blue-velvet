import { mongoose } from '../../mongo.js'
let { ObjectId } = mongoose.Types

import adminAuth from '../../firebaseAdmin.js'

import { hashPassphrase, genPassphrase } from './helper.js'
import { getOrganizationById, newOrganization, deleteOrganization } from '../organization/store.js'
import { newPassphrase, deletePassphrase } from '../passphrase/store.js'
import { newClient } from '../client/store.js'
import { newClientSuperAdmin } from '../superadmin/store.js'

export function deleteFromFirebase(uid) {
    return new Promise((resolve, reject) => {
        adminAuth.deleteUser(uid)
        .then(() => {
            resolve("User removed from google")
        })
        .catch((err) => {
            reject(err)
        })
    })
}

export function newEmployee(res,data) {
    return new Promise((resolve, reject) => {
        // * Create account on firebase
        adminAuth.createUser({
            email:          data.email,
            phoneNumber: data.phone,
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

            console.log(res.locals.organization)
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
                    address:        data.address,
                    performance: {
                        level:0,
                        allocationRatio:0,
                        workdays:0,
                        packages:0,
                        harvested:0,
                        seeds:0,
                        penalties:0,
                    }
                }

                // * Add employee to record
                org.employees.push(empData)

                org.save((err, doc) => {
                    if (err) reject(err)
                    resolve(doc)
                })
            })
            .catch((err) => {
                console.log('Deleting employee account on firebaseAtuh due to an error updating the organization:', err)
                adminAuth.deleteUser(userRecord.uid)
                reject(err)
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
            phoneNumber: data.phone,
            emailVerified: false,
            password: data.password,
            displayName: data.name + " " + data.lname,
            photoURL: data.image,
            disabled: false,
        })
        .then((userRecord) => {
            
            console.log('Successfully created new user on firebase:', userRecord.uid);
            
            // * Generate ObjectId for client document
            let id = new ObjectId()
            
            // * Register organization
            // * It's impoertant to do this step first to avoid 
            // * any inconsistency and provide proper ObjectIds
            
            let orgData = {
                ...data.organization,
                owner:      id
            }
            
            newOrganization(orgData)
            .then(org => {
                console.log("Succesfully created organization")
                // * Update customUserClaims
                adminAuth.setCustomUserClaims(userRecord.uid, { role: "admin", organization: org._id })
                
                // * Generate hashed passphrase mongo record
                let hashedPassphrase = hashPassphrase(data.passphrase !== undefined ? data.passphrase : genPassphrase(3))
                
                let passData = {
                    client:         id,
                    uid:            userRecord.uid,
                    passphrase:     hashedPassphrase,
                    organization:   org._id
                }

                newPassphrase(passData)
                .then(pass => {
                    
                    let clientData = {
                        _id:                id,
                        uid:                userRecord.uid,
                        email:              data.email,
                        passphrase:         pass._id,
                        organization:       org._id,
                        name:               data.name,
                        lname:              data.lname,
                        phone:              data.phone,
                        image:              data.image,
                        businessName:       data.organization.name,
                        socialInsurance:    data.socialInsurance,
                        bankAccount:        data.bankAccount,
                        address:            data.organization.address
                    }

                    console.log(clientData)
    
                    newClient(clientData)
                    .then(client => resolve(client))
                    .catch((err) => {
                        adminAuth.deleteUser(userRecord.uid);
                        deleteOrganization(org._id)
                        .then(org => {
                            deletePassphrase(clientData._id)
                                .then(pass => resolve(pass))
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(err))

                        reject(err)
                    })
                })
                .catch((error) => {
                    console.log('Error creating new passphrase on MongoDB:', error)
                    // * Delete account from firebase as rollback
                    adminAuth.deleteUser(userRecord.uid)
                    deleteOrganization(org._id)
                        .then(org => resolve(org))
                        .catch(err => reject(err))
                })
            })
            .catch((error) => {
                console.log('Error creating new organization on MongoDB:', error)
                // * Delete account from firebase as rollback
                adminAuth.deleteUser(userRecord.uid)
                reject(error)
            })
        })
        .catch((error) => {
            console.log('Error creating new admin user on firebaseAtuh:', error)
            reject(error)
        })
    })
}

export function newSuperAdmin(data) {
    return new Promise((resolve, reject) => {
        // * Create account on firebase
        adminAuth.createUser({
            email: data.email,
            emailVerified: false,
            password: data.password,
            phoneNumber: data.phone,
            displayName: data.name + " " + data.lname,
            photoURL: data.image,
            disabled: false,
        })
        .then((userRecord) => {
            
            console.log('Successfully created new user (superadmin) on firebase:', userRecord.uid);
            
            // * Generate ObjectId for client document
            let id = new ObjectId()
            
            // * Update customUserClaims
            adminAuth.setCustomUserClaims(userRecord.uid, { role: "superadmin"})
            
            // * Generate hashed passphrase mongo record
            let hashedPassphrase = hashPassphrase(data.passphrase !== undefined ? data.passphrase : genPassphrase(3))
            
            let passData = {
                client:         id,
                uid:            userRecord.uid,
                passphrase:     hashedPassphrase,
            }

            newPassphrase(passData)
            .then(pass => {
                let clientData = {
                    _id:          id,
                    uid:          userRecord.uid,
                    email:        data.email,
                    passphrase:   pass._id,
                    name:         data.name,
                    lname:        data.lname,
                    phone:        data.phone,
                    image:        data.image,
                }

                console.log(clientData)

                newClientSuperAdmin(clientData)
                .then(client => resolve(client))
                .catch(err => reject(err))

            })
            .catch((error) => {
                console.log('Error creating new passphrase on MongoDB:', error)
                // * Delete account from firebase as rollback
                adminAuth.deleteUser(userRecord.uid)
                reject(error)
            })
        })
        .catch((error) => {
            console.log('Error creating new admin user on firebaseAtuh:', error)
            reject(error)
        })
    })
}

export function updateUser(data) {
    return new Promise((resolve, reject) => {
        adminAuth.updateUser(data.uid,{
            email: data.email,
            phoneNumber: data.phone,
            password: data.password,
            displayName: data.name + " " + data.lname,
            photoURL: data.image,
        })
        .then((userRecord) => {
            resolve('User updated successfully', userRecord);
        })
        .catch((error) => {
            console.log('[Error updating user]');
            reject(error);
        });
    })
}