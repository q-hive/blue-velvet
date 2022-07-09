import { mongoose } from 'mongoose'
import { adminAuth } from '../../firebaseAdmin.js'
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
            adminAuth.setCustomUserClaims(userRecord.uid, {role:_ "admin"})
            .then(() => {
                // TODO: Register metadata on mongodb
                
            })
            .catch((error) => {
                console.log('Error creating new admin user on firebaseAtuh:', error);
            })

          })
          .catch((error) => {
            console.log('Error creating new admin user on firebaseAtuh:', error);
          })
    })
}