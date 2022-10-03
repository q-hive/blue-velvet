import express from "express";
import { getOrganizationById } from "../organization/store.js";
import { error, success } from "../../network/response.js";
import adminAuth from '../../firebaseAdmin.js'
import {mongoose} from '../../mongo.js'
import Organization from "../../models/organization.js";
import { deleteFromFirebase } from "../admin/store.js";
import { deleteEmployeeFromDB } from "./store.js";

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