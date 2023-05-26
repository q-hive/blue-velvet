import { error } from "../../network/response.js"

const roles = ["admin", "cockpit", "employee"]

const isEmailValid = (req, res, email) => {
    const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/   

    const isValid =  regexp.test(email)

    if(!isValid)
        error(req, res, 400, "Email does not match the regular expression.", new Error("Inconsistent payload"))
}

const validateBodyNotEmpty = (req, res) => {
    if (!Object.keys(req.body).length>0){
        error(req, res, 400, "Payload is incosistent", new Error("The body is empty"))
        return true
    } 
    return false    
}

export { roles, isEmailValid, validateBodyNotEmpty }