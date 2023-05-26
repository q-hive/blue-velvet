/**
 * @param {*} queryConfig
 * @description receives and object with the following model
 * {
 *      query: String,
 *      value: Any
 * }
 */
export const getMongoQueryByObject = (queryConfig) => {
    const {query} = queryConfig
    const defaultConfig = "set"
    
    const queryKeys = {
        "set": "$set",
        "add": "$inc",
        "multiply": "$mul"
    }

    let selected = queryKeys[query]

    if(!selected){
        selected = queryKeys[defaultConfig]
    }

    return selected
}