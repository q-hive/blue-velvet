import express from 'express'
import {error, success} from '../../network/response.js'
import { isEmailValid, validateBodyNotEmpty } from './secureHelpers.js'
import userCreationRouter from '../admin/network.js'
import { getUserByFirebaseId } from '../admin/store.js'

//*Simple firebase
import auth from '../../firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'

//*FIREBASE ADMIN
import adminAuth from '../../firebaseAdmin.js'
import { hashPassphrase } from '../admin/helper.js'

const authRouter = express.Router()

authRouter.post('/login', (req, res) => {
    validateBodyNotEmpty(req, res)

    if(isEmailValid(req.body.email) && req.body.password !== ""){
        signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then(user => {
            adminAuth.verifyIdToken(user._tokenResponse.idToken)
            .then(claims => {
                if (claims.role === 'admin') {
                    return success(req, res, 200, "Authentication succeed", { isAdmin: true })
                }
                getUserByFirebaseId(user.user.uid)
                .then(data => success(req, res, 200, "Authentication success", 
                { 
                    isAdmin: false,
                    user: data, 
                    token: user._tokenResponse.idToken
                }))
            })
            .catch(err => {
                error(req, res, 500, "Error verifying ID Token", err)
            })
            return
        })
        .catch(err => {
            error(req, res, 500, "Error signing in", err)            
            return
        })
        return

    }

    error(req,res,400, "Invalid request", new Error("Any successful validation"))
})

authRouter.post('/login/admin', (req, res) => {
    validateBodyNotEmpty(req, res)

    if(isEmailValid(req.body.email) && req.body.password !== "") {
        signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then(user => {
            adminAuth.verifyIdToken(user._tokenResponse.idToken)
            .then(claims => {
                // * Generate containers
                if (claims.role === 'admin') {
                    getUserByFirebaseId(user.user.uid)
                    .then(data => {
                        console.log(data)
                        if (data.passphrase == hashPassphrase(req.body.passphrase)) 
                            success(req, res, 200, "Successfully logged as admin", {                                                                                                  
                                user: {
                                    id:     data._id,
                                    role:   claims.role,
                                    uid:    user.user.uid,
                                    email:  user.user.email,
                                    photo:  user.user.photoURL
                                },
                                token: user._tokenResponse.idToken
                            })
                        else error(req, res, 403, "Forbidden: Wrong passphrase", { "error": "Wrong passphrase"})
                    })
                    return 
                }
                return error(req, res, 403, "Forbidden: Not admin", { "error": "Not admin role"})
            })
            .catch(err => {
                return error(req, res, 500, "Error verifying ID Token", err)
            }) 
        })
        .catch(err => {
            return error(req, res, 500, "Error signing in", err)              
        })
        return 
    }

    return error(req, res, 400, "Invalid request", new Error("Any successful validation"))
})

//*TODO CRRETE LOGOUT
authRouter.post('/logout', (req, res) => {
    validateBodyNotEmpty(req, res)
})
//*TODO CREATE REFRESH
authRouter.post('/refresh', (req, res) => {
    validateBodyNotEmpty(req, res)
})

authRouter.use('/create', userCreationRouter)

export default authRouter