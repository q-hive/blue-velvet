import express from 'express'
import multer from 'multer'
import { error, success } from '../../network/response.js'
import { newEmployee, newAdmin, newSuperAdmin } from './store.js'  

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/employee', (req, res) => {
    newEmployee(res, req.body)
    .then(result => {
        success(req, res, 201, "Employee has been created successfully", result)
    })
    .catch(err => {
        error(req, res, 400, "Error creating employee", err)
    })   
})

router.post('/admin', upload.single('image'), (req, res) => {
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