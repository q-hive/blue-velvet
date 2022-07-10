//*RETURNS A FORMATTED MESSAGE FOR CLIENT
export const modelsValidationError = (err) => {
    return `The following data is invalid: ${Object.keys(err.errors)}`
}