import express from 'express'
import { error, success } from '../../network/response.js'
import { newEmployee, newAdminAccount } from './store.js'  

const router = express.Router()

router.post('/create/employee', (req, res) => {
    newEmployee(req.body)
    .then(result => {
        success(req, res, 201, "Employee has been created successfully", result)
    })
    .catch(err => {
        error(req, res, 400, "Error creating employee", err)
    })   
})

router.post('/create/admin', (req, res) => {
    newAdminAccount(req.body)
    .then(result => {
        success(req, res, 201, "Employee has been created successfully", result)
    })
    .catch(err => {
        error(req, res, 400, "Error creating employee", err)
    })  
})



export default router