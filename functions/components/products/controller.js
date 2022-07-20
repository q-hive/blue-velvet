import product from '../../models/product.js'
import { getOrdersByProd } from '../orders/store.js'
import { getTaskByProdId } from '../tasks/store.js'
import { getAllProducts } from './store.js'

const hasEveryKey = (valid, current) => {
     //*Verificar que el objeto tenga todas las llaves del modelo
     return valid.every(key => Object.keys(current).includes(key))
}

export const isValidProductObject = (json) => {
        const validKeys = Object.keys(product.obj)
        validKeys.shift()
        // //*Si el objeto tienes la cantidad de llaves que el modelo sin contar el _id, siguiente validacion
        // if(!(Object.keys(json).length === Object.keys(product.obj).length-1)){
        //    return false
        // }

        // if(!hasEveryKey(validKeys, json)) {
        //     return false
        // }
        //*Si tiene todos los campos, validar que el formato del valor del campo sea correcto
        return true
}

export const relateOrdersAndTasks = async () => {
    //*ASK FOR PRODUCTS ARRAY
    const products = await getAllProducts()
    if(products.length>0) {
        //* ITERATE ARRAY
        const tasksByProducts = products.map(async (prod) => {
            //* AND SEARCH IN TASKS BY PRODUCTS
            const tasks = await getTaskByProdId(prod._id)
            //*SEARCH IN ORDERS BY PRODUCT ID
            const orders = await getOrdersByProd(prod._id)
            prod.tasks = [...tasks]
            prod.orders = [...orders]
            return prod
        })
        return Promise.all(tasksByProducts)
        .then((data) => {
            return data
        })
        .catch((err) => {
            Promise.reject(err)
        })
    }

    return products
    //? ARE TASKS REALLY RELATED TO THE PRODUCTS? no
}