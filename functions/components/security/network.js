import express from 'express'
import { error, success } from '../../network/response.js'
import { isEmailValid, validateBodyNotEmpty } from './secureHelpers.js'
import userCreationRouter from '../admin/network.js'
import {  } from '../admin/store.js'

import { getOrganizationById } from '../organization/store.js'

// * Authentication
import { isAuthenticated, isAuthorized, getPassphraseByUid } from './controller.js'

//*Simple firebase
import auth from '../../firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'

//*FIREBASE ADMIN
import adminAuth from '../../firebaseAdmin.js'
import { hashPassphrase } from '../admin/helper.js'
import mongoose from 'mongoose'
import Employee from '../../models/employee.js'

const authRouter = express.Router()

authRouter.post('/login', (req, res) => {
    validateBodyNotEmpty(req, res)
    isEmailValid(req, res, req.body.email)

    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then(credential => {
        console.log("Signed in")
        adminAuth.verifyIdToken(credential._tokenResponse.idToken)
        .then(claims => {
            console.log("Id token verified")
            if (claims.role === 'admin' || claims.role === 'root') {
                return success(req, res, 200, "Authentication succeed", { isAdmin: true, token:credential._tokenResponse.idToken, user:credential })
            } else if (claims.role === 'employee') {
                // * Obtain organization info to query for employee data
                console.group("Auth logs")
                console.log(claims)
                getOrganizationById(claims.organization)
                .then(async organization => {
                    const employee = organization.employees.find(employee => employee.uid === credential.user.uid) 
                    let token
                    if(employee) {
                        try {
                            token = await adminAuth.createCustomToken(employee.uid)
                        } catch(err) {
                            return error(req, res, 500, "Error creating credential", err)
                        }    

                        return success(req, res, 200, "Employee login successful", {
                            isAdmin: false,
                            token: token,
                            user: employee
                        })
                    }

                    return error(req, res, 400, "No employee found", new Error("No employee in DB"))
                })
                .catch(err => error(req, res, 500, "Error verifying ID Token", err))
            }
        })
        .catch(err => error(req, res, 500, "ID Token verification failed", err))
    })
    .catch(err => error(req, res, 500, "Error signing in", err))
})

authRouter.post('/login/admin', (req, res) => {
    validateBodyNotEmpty(req, res)
    isEmailValid(req, res, req.body.email)

    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then(user => {
        console.log("Admin signed id")
        adminAuth.verifyIdToken(user._tokenResponse.idToken)
        .then(claims => {
            if (claims.role === 'admin') {
                console.log(user.user)
                getPassphraseByUid(user.user.uid)
                .then(async data => {
                    console.log(data)
                    let token
                    try {
                        token = await adminAuth.createCustomToken(user.user.uid)
                        if (data.passphrase == hashPassphrase(req.body.passphrase)) {
    
                            return success(req, res, 200, "Successfully logged as admin", {                                                                                                  
                                            user: {
                                                id:     data._id,
                                                role:   claims.role,
                                                uid:    user.user.uid,
                                                email:  user.user.email,
                                                photo:  user.user.photoURL
                                            },
                                            token: user._tokenResponse.idToken,
                                            cToken: token
                            })
                        
                        } else {
                            return error(req, res, 403, "Forbidden: Wrong passphrase", { "error": "Wrong passphrase"})
                        }
                    } catch (err) {
                        const errorJSON = {
                            "message":  "Error trying to create custom token",
                            "status":   500,
                            "processError": err.message
                        }
                        return error(req, res, 500, "Error trying to create custom token - GENERIC ERROR", new Error(JSON.stringify(errorJSON)), err)
                    }
                    
                })
            } else {
                return error(req, res, 403, "Forbidden: Not admin", { "error": "Not admin role"})
            }
        })
        .catch(err => error(req, res, 500, "Error verifying ID Token", err)) 
    })
    .catch(err => error(req, res, 500, "Error signing in", err))
})

//*TODO CRRETE LOGOUT
authRouter.post('/logout', (req, res) => {
    validateBodyNotEmpty(req, res)
})
//*TODO CREATE REFRESH
authRouter.post('/refresh', (req, res) => {
    // validateBodyNotEmpty(req, res)
    
   adminAuth.verifyIdToken(req.headers.authorization)
   .then((claims) => {
    getOrganizationById(claims.organization)
    .then(async org => {
            let token
            if(claims.role === "admin") {
                const admin = await adminAuth.getUser(claims.uid)
                token = await adminAuth.createCustomToken(claims.uid)
                return success(res, res, 200, "User verified succesfully, re-auth done", {
                    isAdmin:    true,
                    token:      token,
                    user:       admin
                })
            }
            const employee = org.employees.find((empl) => empl.uid === claims.uid)
            try {
                if(employee){
                    token = await adminAuth.createCustomToken(employee.uid)
                }
            } catch(err){
                console.log("Error trying to create token")
            }

            return success(req, res, 200, "User verified succesfully, re-auth done", {
                isAdmin:false,
                token:token,
                user:employee
            })
        })
        .catch(err => {
            console.log("Error getting organization")
            console.log(err)
        })
    })
   .catch(err => {
        console.log("Error verifying ID token")
        console.log(err)
    }) 
})

authRouter.use('/create', isAuthenticated, isAuthorized(["admin"]), userCreationRouter)


export default authRouter