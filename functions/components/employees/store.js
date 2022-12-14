import {mongoose} from "../../mongo.js";
import Organization from "../../models/organization.js";
import { getOrganizationById } from "../organization/store.js";

const orgModel = mongoose.model('organization', Organization)

export const getEmployeeById = (orgId, employeeId) => {
    return new Promise(async (resolve, reject) =>{
        try {
            const result  =  await orgModel.aggregate(
                [
                    {
                        "$match": {
                            "_id": mongoose.Types.ObjectId(orgId),
                        
                        }
                    },
                    {
                        "$unwind":"$employees"
                    },
                    {
                        "$match": {
                            "employees._id": mongoose.Types.ObjectId(employeeId)
                        }
                    },
                    {
                        "$project":{
                            "employees":true
                        }
                    }
                
                ]
            )
            console.log(result[0].employees)
            resolve(result[0].employees)

        } catch (err) {
            reject(err)
        }
        
       
        // getOrganizationById(orgId)
        // .then((org) => {
        //     if(org){
        //         const employee = org.employees.find((employee) => employee._id.equals(employeeId))
        //         resolve(employee)
        //     }

        //     reject(org)
        // })
        // .catch((err) => {
        //     reject(err)
        // })
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

export const getEmployeesWithAggregation = (orgId, aggregationObject) => {
    return new Promise(async (resolve, reject) => {
        try {
            const aggregationStages = aggregationObject
            const queryResult = await orgModel.findOne({"_id":orgId}, aggregationStages)
            resolve(queryResult)
        } catch (err) {
            reject(err)
        }
    })
}

export const updateEmployee = (orgId,id,queryObj) => {
    return new Promise(async (resolve, reject) => {
        
        let result = {}

        try {
            if(Object.keys(queryObj)[0] === "workDay"){
                result = await orgModel.updateOne(
                    {
                        "_id":mongoose.Types.ObjectId(orgId),
                        "employees": {
                            "$elemMatch": {
                                "_id":mongoose.Types.ObjectId(id)
                            }
                        }
                    }, 
                    {
                        "$set": {
                            "employees.$[emp].workDay":queryObj.workDay
                        }
                    },
                    {
                        "arrayFilters":[{"emp._id":mongoose.Types.ObjectId(id)}]
                    }
                )
            }
        } catch (err) {
            reject(err)     
        }

        resolve(result)
    })
}