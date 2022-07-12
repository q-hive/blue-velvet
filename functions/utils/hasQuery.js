//*Validate if a request has a query string, and if the keys of the object are valid as query
export const hasQueryString = (req, validKeys) => {
    //*If query string is different from undefined or empty object and includes every key in the validkeys array
    if(req.query !== (undefined || {} ) && validKeys.some(key => Object.keys(req.query).includes(key))){
        return true
    }

    return false

}