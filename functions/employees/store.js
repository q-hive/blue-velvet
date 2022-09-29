import {mongoose} from "../mongo.js";
import Organization from "../models/organization.js";
import { getOrganizationById } from "../components/organization/store.js";

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