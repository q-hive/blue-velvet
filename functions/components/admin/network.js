import express from 'express'
import { error, success } from '../../network/response.js'
import { newEmployee, newAdmin, newSuperAdmin } from './store.js'  

const router = express.Router()

router.post('/employee', (req, res) => {
    newEmployee(res, req.body)
    .then(result => {
        success(req, res, 201, "Employee has been created successfully", result)
    })
    .catch(err => {
        error(req, res, 400, "Error creating employee", err)
    })   
})

router.post('/admin', (req, res) => {
    newAdmin(req.body)
    .then(result => {
        success(req, res, 201, "Admin account has been created successfully", result)
    })
    .catch(err => {
        error(req, res, 400, "Error creating admin", err)
    })  
})

router.post('/superadmin', (req, res) => {
    newSuperAdmin(req.body)
    .then(result => {
        success(req, res, 201, "Super Admin account has been created successfully", result)
    })
    .catch(err => {
        error(req, res, 400, "Error creating Super Admin", err)
    })  
})

export default router