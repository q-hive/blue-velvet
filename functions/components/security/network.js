import express from 'express'
import {error, success} from '../../network/response.js'
import { isEmailValid } from './secureHelpers.js'

//*Simple firebase
import auth from '../../firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'

//*FIREBASE ADMIN
import adminAuth from '../../firebaseAdmin.js'

const authRouter = express.Router()

authRouter.post('/login', (req, res) => {
    if(req.body === {}){
        error(req, res, 400, "Payload is incosistent", new Error("The body is empty"))
        return
    }

    if(isEmailValid(req.body.email) && req.body.password !== ""){
        signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then(credential => {
            adminAuth.verifyIdToken(credential._tokenResponse.idToken)
            .then(user => {
                // TODO: Obtain token and send depending on response
                success(req, res, 200, "Authentication succeed", {user:user})
            })
            .catch(err => {
                error(req, res, 500, "Internal error, try again", err)
            })
            return
        })
        .catch(err => {
            error(req, res, 500, "Internal error, try again", err)            
            return
        })
        return

    }

    error(req,res,400, "Invalid request", new Error("Any successful validation"))
})

authRouter.post('/login/admin', (req, res) => {
    
})

//*TODO CRRETE LOGOUT

//*TODO CREATE REFRESH

//TODO REGISTER ADMIN
//TODO REGISTER EMPLOYEE

export default authRouter