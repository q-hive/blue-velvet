const roles = ["admin", "cockpit", "employee"]

const isEmailValid = (email) => {
    const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/   
    return regexp.test(email)
}

const validateBodyNotEmpty = (req, res) => {
    if (!req.body || req.body === {}) 
        error(req, res, 400, "Payload is incosistent", new Error("The body is empty"))
}

export { roles, isEmailValid, validateBodyNotEmpty }