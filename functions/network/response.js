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

export const error = (req,res,code,message, error) => {
    console.log(error)
    return res.status(code).send({
        "success":  false,
        "error":    OPERATION_FAILED,
        "message":  message
    })
}