import { mongoose } from '../../mongo.js'
import adminAuth from '../../firebaseAdmin.js'
import User from '../../models/employee.js'
import { hashPassphrase, genPassphrase } from './helper.js'
import { newContainer, getContainers, updateContainers } from '../container/store.js'
import { newOrganization, updateOrganization } from '../organization/store.js'

var userModel = mongoose.model('users', User)

export function newEmployee(data) {
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
        .then((userRecord) => {
            console.log('Successfully created new user on firebase:', userRecord.uid);
            // * Update role to employee in custom claims
            adminAuth.setCustomUserClaims(userRecord.uid, { role: "employee" })
            .then(() => {
                getContainers({ 
                    organization:   data.organization
                })
                .then(containers => {
                    let containerIds = containers.map(cont => cont._id)
                    console.log(containers[0])
                    let admin = containers[0].admin
                    
                    let userModel = new mongoose.model('users', User)

                    let userData = {
                        uid:            userRecord.uid,  
                        email:          data.email,
                        name:           data.name,
                        lname:          data.lname,
                        role:           "employee",
                        containers:     containerIds,
                        clients:        data.clients,
                        admin:          admin,
                        organization:   data.organization,
                        address:        data.address,
                        salary:         data.salary || 0,
                        phone:          data.phone
                    }

                    let mongoUser = new userModel(userData)

                    mongoUser.save((e, user) => {
                        if (e) reject(e)
                        
                        Promise.all([
                            // * Update containers field
                            updateContainers(containerIds, {
                                $push: { employees: user._id }
                            }),
                            // * Update organization field
                            updateOrganization(data.organization, {
                                $push: { employees: user._id }
                            })
                        ]).then(() => resolve(userData))    
                    })
                })          
            })
            .catch(err => {
                console.log('Error assigning employee role on user at firebaseAtuh:', err)
                reject(err)
            })
        })
        .catch(err => {
            console.log('Error creating new admin user on firebaseAtuh:', err)
            reject(err)
        })

    })
}

export function newAdminAccount(data) {
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
                    let hashedPassphrase = hashPassphrase(data.passphrase !== undefined ? data.passphrase : genPassphrase(3))
                    let userModel = new mongoose.model('users', User)
                    
                    let userData = {
                        uid:            userRecord.uid,
                        email:          data.email,
                        name:           data.name,
                        lname:          data.lname,
                        role:           "admin",
                        organization:   org._id,
                        image:          data.image,
                        phone:          data.phone,
                        address:        data.address
                    }
    
                    let mongoUser = new userModel(userData)
    
                    mongoUser.save((e, user) => {
                        if (e) reject(e)
                        console.log("error", e)
                        // * Update the admin field in organization
                        updateOrganization(org._id, {
                            $set: { owner: user._id }
                        })
                        .then(upOrg => {
                            // * Register all containers with correct admin
                            Promise.all(data.containers.map(contData => newContainer({
                                ...contData,
                                admin:          user._id,
                                organization:   upOrg._id
                            })))
                            .then(containerIds => {
                                delete userData.passphrase
                                resolve({
                                    ...userData,
                                    containers: containerIds.map(contRes => contRes._id)
                                })
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

export async function updateUser(id, edit) {
    let user = await userModel.findOneAndUpdate({ _id: id }, edit, { new: true })
    return user   
}

export async function getUserByFirebaseId(uid) {
    let user = await userModel.findOne({ uid: uid })
    return user
}

export async function getUserById(id) {
    let user = await userModel.findOneById(id)
    return user
}

export async function getEmployeesByAdmin(admin) {

}

export async function deleteEmployee(id) {

    // * Obtain user info
    let user = await getUserById(id)

    // * Delete employee record from organization
    let org = await updateOrganization(user.organization, { $pull: { employees: user._id } })
    // * Delete employee record from containers
    let cont = await updateContainers(user.containers, { $pull: { employees: user._id } })
    // TODO: Delete employee record from tasks
    //   * 1 - Obtain related tasks
    //   * 2 - Update related task


}

export async function deleteAdmin(id, options) {}

export async function deleteOrganization(id, options) {}