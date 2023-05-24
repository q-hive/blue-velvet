import express from 'express'
import { error, success } from '../../network/response.js'
import { newSuperAdmin } from './store.js'  

const router = express.Router()

router.post('/', () => {
    newSuperAdmin(req, res)
    .then(result => {
        success(req, res, 201, "Super Admin account has been created successfully", result)
    })
    .catch(err => {
        error(req, res, 400, "Error creating super admin account", err)
    })
})

//*CUSTOMER OF COCKPIT CREATION ENDPOINT
router.post('/admin', (req, res) => {
    newAdmin(req.body)
    .then(result => {
        success(req, res, 201, "Admin account has been created successfully", result)
    })
    .catch(err => {
        error(req, res, 400, "Error creating admin", err)
    })  
})

export default router