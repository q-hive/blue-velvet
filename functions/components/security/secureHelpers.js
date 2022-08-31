import { error } from "../../network/response.js"

const roles = ["admin", "cockpit", "employee"]

const isEmailValid = (email) => {
    const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/   
    return regexp.test(email)
}

const validateBodyNotEmpty = (req, res) => {
    if (!Object.keys(req.body).length>0){
        error(req, res, 400, "Payload is incosistent", new Error("The body is empty"))
        return true
    } 
    return false    
}

export { roles, isEmailValid, validateBodyNotEmpty }