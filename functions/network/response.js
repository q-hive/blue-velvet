const OPERATION_FAILED = 'OPERATION.FAILED'

export const success = (req, res, code, message, data=null) => {
    return res.status(code).send({
        "success":  true,
        "error":    false,
        "message":  message,
        "data":     data
    })
}

export const processing = (req, res, code, message, status, data) => {
    return res.status(code).send({
        "success":  true,
        "error":    false,
        "message":  message,
        "data":     data,
        "status":   status
    })
}

export const error = (req,res,code, message, error, processError = undefined) => {
    try {
        let parsedError = JSON.parse(error.message)
        if(processError){
        }
        return res.status(parsedError.status).send({
            "success":  false,
            "error":    OPERATION_FAILED,
            "message":  parsedError.message,
        })
    
    } catch(err) {
        console.log(err)
        return res.status(code).send({
            "success":  false,
            "error":    OPERATION_FAILED,
            "message":  message
        })
    }
}