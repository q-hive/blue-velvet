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

    return queryKeys[queryConfig] ?? queryKeys[defaultConfig]
}