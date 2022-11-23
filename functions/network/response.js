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

//*ERROR PARAMETER IS THE CUSTOM ERROR OBJECT, PROCESS ERROR COMES FROM SYSTEM ERRORS OR UNHANDLED REJECTIONS
export const error = (req,res,code, message, error, processError = undefined) => {
    try {
        //*If a JSON is provided in the error helper then it will be parsed
        if(error){
            return res.status(JSON.parse(error.message).status).send({
                "success": false,
                "error": OPERATION_FAILED,
                message: JSON.parse(error).message
            })
        }
    } catch(err) {
        try {
            if(error){
                console.log(error.message)
                switch(err.name){
                    case "MongooseError":
                        return res.status(code).send({
                            "success":  false,
                            "error":    OPERATION_FAILED,
                            "message":  error.message
                        })
                    case "ValidationError":
                        return res.status(code).send({
                            "success":  false,
                            "error":    OPERATION_FAILED,
                            "message":  `${err._message} in the following keys: ${Object.keys(err.errors)}`
                        })
                    case "Error":
                        return res.status(code).send({
                            "success":  false,
                            "error":    OPERATION_FAILED,
                            "message":  err.message
                        })
                    default:
                        return res.status(code).send({
                            "success":  false,
                            "error":    OPERATION_FAILED,
                            "message":  message
                        })
                }
            }
        } catch (ndErr) {
            return res.status(code).send({
                "success":  false,
                "error":    OPERATION_FAILED,
                "message":  message
            })
        }
        
        
    }
}