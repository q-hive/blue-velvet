import express from 'express'
import {error, success} from '../../network/response.js'
import { isEmailValid, validateBodyNotEmpty } from './secureHelpers.js'

//*Simple firebase
import auth from '../../firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'

//*FIREBASE ADMIN
import adminAuth from '../../firebaseAdmin.js'

const authRouter = express.Router()

authRouter.post('/login', (req, res) => {
    validateBodyNotEmpty(req, res)

    if(isEmailValid(req.body.email) && req.body.password !== ""){
        signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then(user => {
            adminAuth.verifyIdToken(user._tokenResponse.idToken)
            .then(claims => {
                // * Generate containers
                success(req, res, 200, "Authentication succeed", 
                    claims.role === 'admin'
                    ? { isAdmin: true }   
                    : {
                        isAdmin: false,
                        user: {
                            ...user,
                            role: claims.role
                        }, 
                        token: user._tokenResponse.idToken
                    }    
                )
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
})

//*TODO CRRETE LOGOUT
authRouter.post('/logout', (req, res) => {
    validateBodyNotEmpty(req, res)
})
//*TODO CREATE REFRESH
authRouter.post('/refresh', (req, res) => {
    validateBodyNotEmpty(req, res)
})
//TODO REGISTER EMPLOYEE

export default authRouter