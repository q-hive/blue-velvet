import {mongoose} from "../../mongo.js";
import Organization from "../../models/organization.js";
import { getOrganizationById } from "../organization/store.js";

const orgModel = mongoose.model('organization', Organization)

export const getEmployeeById = (orgId, employeeId) => {
    return new Promise((resolve, reject) =>{
        getOrganizationById(orgId)
        .then((org) => {
            if(org){
                const employee = org.employees.find((employee) => employee._id.equals(employeeId))
                resolve(employee)
            }

            reject(org)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

export const deleteEmployeeFromDB = (req, res) => {
    return new Promise((resolve, reject) => {
        orgModel.findOneAndUpdate(
            {
                "_id":res.locals.organization,
                "employees._id":req.params.id
            },
            {
                "$pull": {"employees":{
                    "_id":req.params.id
                }}
            }
        )
        .then((result) => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
        
    })
}