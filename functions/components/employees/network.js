import express from "express";
import { getOrganizationById } from "../organization/store.js";
import { error, success } from "../../network/response.js";
import adminAuth from '../../firebaseAdmin.js'
import {mongoose} from '../../mongo.js'
import Organization from "../../models/organization.js";
import { deleteFromFirebase } from "../admin/store.js";
import { deleteEmployeeFromDB, getEmployeeById, getEmployeesWithAggregation } from "./store.js";
import { getEmployeesPerformance } from "./controller.js";
import { calculateTimeEstimation } from "../work/controller.js";

const orgModel = mongoose.model('organizations', Organization)

const router = express.Router()

router.get('/', (req, res) => {
    getOrganizationById(res.locals.organization)
    .then((org) => {
        success(req, res, 200,"Employees obtained succesfully", org.employees)
    })
    .catch((err) => {
        error(req, res, 500, "Generic ERROR - Error getting employees", err, err)
    })
})

router.get('/:id', (req, res) => {
    getEmployeeById(res.locals.organization, req.params.id)
    .then((result) => {
        success(req, res, 200, "Employee obtained succesfully", result)
    })
    .catch(err => {
        error(req, res, 500, "Error getting employee data", err, err)
    })
})

router.get('/analytics/performance', (req, res) => {
    getEmployeesPerformance(res.locals.organization)
    .then(data => {
        success(req, res, 200, "Employees performance obtained succesfully", data)
    })
    .catch(err => {
        error(req, res, 500, "Error getting employees performance", err, err)
    })
})
router.get('/analytics/workday', (req, res) => {
    getEmployeesWithAggregation(res.locals.organization, {"employees":{"_id":true,"workDay":true, "name":true}})
    .then(data => {
        try {
            
            const mappedData = data.employees.map((employee) => {
                if(employee.workDay === undefined || Object.keys(employee.workDay).length === 0) {
                    return {name:employee.name, _id:employee._id, workDay:{}}
                }
                
                //*DELETE NO DATA TASKS
                Object.keys(employee.workDay).map((key) => {
                    if(employee.workDay[key].expectedTime === 0){
                        delete employee.workDay[key]
                    }
                })
                
                if(employee.workDay === undefined || Object.keys(employee.workDay).length === 0) {
                    return {name:employee.name, _id:employee._id, workDay:{}}
                }
                
                return employee
            })
            console.log(mappedData)


            success(req, res, 200, "Employees workDay analytics obtained succesfully", data.employees)
        } catch (err) {
            success(req, res, 200, "Employees workday analytics obtained with errors: ", data)
        }
        
        
    })
    .catch(err => {
        error(req, res, 500, "Error getting employees performance", err, err)
    })
})

router.delete('/:id', (req, res) => {
    orgModel.find(
        {
            "_id":res.locals.organization,
            "employees._id":req.params.id
        },
        {
            employees:1
        }
    )
    .then((found) => {
        let employee
        found.forEach((org) => {
            employee = org.employees.find((emp) => emp._id.equals(req.params.id))
        })
        deleteFromFirebase(employee.uid)
        .then(() => {
            deleteEmployeeFromDB(req, res)
            .then((result) => {
                success(req, res, 204, "Employee deleted succesfully")
            })
            .catch(err => {
                error(req, res, 500, "GENERIC ERROR - Deleting employee", err, err)
            })
        })
        .catch((err) => {
            switch(err.code){
                case "auth/user-not-found":
                    deleteEmployeeFromDB(req, res)
                    .then(() => {
                        success(req, res, 204, "Employee not found in Google but deleted from DB")
                    })
                    .catch((err) => {
                        error(req, res, 500, "Error deleting from DB", err, err)
                    })
                    return
                default:
                    break;
            }
            error(req, res, 500, "Error deleting from firebase", err, err)
        })

    })
    .catch(err => {
        error(req, res, 500, "Generic ERROR - Deleting user", err, err)      
    })
})


export default router