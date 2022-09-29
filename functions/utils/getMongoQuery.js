/**
 * @param {*} queryConfig
 * @description receives and object with the following model
 * {
 *      query: String,
 *      value: Any
 * }
 */
export const getMongoQueryByReq = (queryConfig) => {
    const {query} = queryConfig
    
    switch(query){
        case "set":
            return '$set'
        case "add":
            return '$inc'
        case "multiply":
            return '$mul'
        default:
            break;
    }
}