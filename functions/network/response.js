export const success = (req, res, code, message, data=null) => {
    res.status(code).send({
        "success":  true,
        "error":    "",
        "message":  message,
        "data":     data
    })
}

export const processing = (req, res, code, message, status, data) => {
    res.status(code).send({
        "success":  true,
        "error":    "",
        "message":  message,
        "data":     data,
        "status":   status
    })
}

export const error = (req,res,code,message, error) => {
    console.log(error)
    if(code === 500){
        res.status(code).send({
            "success":  false,
            "error":    "Operación fallida",
            "message":  "Error interno"
        })
        return
    }
    
    res.status(code).send({
        "success":  false,
        "error":    "Operación fallida",
        "message":  message
    })
}