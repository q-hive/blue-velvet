import { getOrdersByProd } from '../orders/store.js'
import { getTaskByProdId } from '../tasks/store.js'
import { getAllProductsByOrg } from './store.js'

const hasEveryKey = (valid, current) => {
     // * Verificar que el objeto tenga todas las llaves del modelo

     // * iterate valid object if some key isnt included reject
     // * If a value is and object then iterate the object in valid and compare keys of nested object in current 
     // * if al keys are included, validate the data types (mongoose does it automatically)
    if(Object.keys(valid).every(key => Object.keys(current).includes(key))){
        console.log("Has all keys")
        for (const key of Object.keys(valid)) {
            if(typeof valid[key] === "object"){
                console.log("Validating nested object")
                // TODO -esq: Checa la logica aqui 
                // porque si existe un primer objeto valido va a retornar siempre true
                // aun cuando el objeto pueda contener otros objectos invalidos no los va a leer
                // ? Tal vez añadiendo todos los resultados de los hijos a una lista y revisando que la lista solo contenga trues
                // Investiga un poco sobre Depth-First-Search y Breath-First-Search
                return hasEveryKey(valid[key], current[key])
            }
        }
        return true
    } else {
        return false
    }
}

export const isValidProductObject = (json) => {
        let productModel 
    
        productModel = {
            "name":"", 
            "price":"",
            "parameters":{
                "day":"",
                "night":"",
                "seedingRate":"",
                "harvestRate":"" 
            }
        }

        if(json.mix && json.mix.isMix === false){
            productModel = {
                "name":"", 
                "price":"",
                "mix":{
                    "isMix":"",
                }
            }
        } else if(json.mix && json.mix.isMix === true){
            productModel = {
                "name":"", 
                "price":"",
                "mix":{
                    "isMix":"",
                    "name":"",
                    "products":[]
                }
            }
        }

        return hasEveryKey(productModel, json)
}



export const relateOrdersAndTasks = (orgId) => {
    return new Promise(async (resolve, reject) => {
        //*ASK FOR PRODUCTS ARRAY
        const products = await getAllProductsByOrg(orgId)
        if(products.length>0) {
            console.log("Has products")
            //* ITERATE ARRAY
            const tasksByProducts = products.map(async (prod) => {
                //* AND SEARCH IN TASKS BY PRODUCTS
                const tasks = await getTaskByProdId(orgId ,prod._id)
                //*SEARCH IN ORDERS BY PRODUCT ID
                const orders = await getOrdersByProd(orgId, prod._id)
                prod.tasks = [...tasks]
                prod.orders = [...orders]
    
                return prod
            })
            return Promise.all(tasksByProducts)
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err)
            })
        }

        reject("No products added")
    })
}