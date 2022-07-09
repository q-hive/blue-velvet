import product from '../../models/product.js'

const hasEveryKey = (valid, current) => {
     //*Verificar que el objeto tenga todas las llaves del modelo
     return valid.every(key => Object.keys(current).includes(key))
}

export const isValidProductObject = (json) => {
        const validKeys = Object.keys(product.obj)
        validKeys.shift()
        //*Si el objeto tienes la cantidad de llaves que el modelo sin contar el _id, siguiente validacion
        if(!(Object.keys(json).length === Object.keys(product.obj).length-1)){
           return false
        }

        if(!hasEveryKey(validKeys, json)) {
            return false
        }
        //*Si tiene todos los campos, validar que el formato del valor del campo sea correcto
        return true
}