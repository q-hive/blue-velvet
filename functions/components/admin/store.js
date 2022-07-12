import { adminAuth } from '../../firebaseAdmin.js'
import User from '../../models/user'
import { hashPassphrase, genPassphrase } from './helper'

export function newEmployee(data) {
    return new Promise((resolve, reject) => {

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
            console.log('Successfully created new user:', userRecord.uid);
            // * Update role to admin in custom claims
            adminAuth.setCustomUserClaims(userRecord.uid, {role: "admin"})
            .then(() => {
                // TODO: Generate passsphrase and hash it

                let passphrase = hashPassphrase(data.passphrase || genPassphrase())

                // TODO: Register metadata on mongodb
                let mongoUser = new User({
                    email:      data.email,
                    name:       data.name,
                    lname:      data.lname,
                    role:       "ADMIN",
                    passphrase: passphrase,
                    containers: data.containers,
                    customers:  data.customers,
                    address:    data.address
                })
                
                await mongoUser.save()
            })
            .catch((error) => {
                console.log(`Error assigning new admin role on ${userRecord.email}:`, error)
            })
        })
        .catch((error) => {
            console.log('Error creating new admin user on firebaseAtuh:', error)
        })
    })
}