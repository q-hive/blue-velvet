const roles = ["admin", "cockpit", "employee"]

const isEmailValid = (email) => {
    const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    
    return regexp.test(email)
}

export {roles, isEmailValid}