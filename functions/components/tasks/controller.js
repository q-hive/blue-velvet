import task from '../../models/task.js'

const hasEveryKey = (valid, current) => {
    return valid.every(key => Object.keys(current).includes(key))
}

export const isValidTaskObject = (json) => {
    const validKeys = Object.keys(task.obj)
    validKeys.shift()

    //*Si el objeto tienes la cantidad de llaves que el modelo sin contar el _id, siguiente validacion
    if(!(Object.keys(json).length === Object.keys(task.obj).length-1)){
        console.log("Longitud invalida")
        return false
     }

     if(!hasEveryKey(validKeys, json)) {
        console.log("Las llaves del objeto no tienen el valor correcto")
        return false
     }
     //*Si tiene todos los campos, validar que el formato del valor del campo sea correcto
     return true
}