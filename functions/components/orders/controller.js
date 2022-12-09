import { areSameDay } from "../../utils/time.js";
import { updateManyOrders } from "./store.js";

const sortProductsPrices = (order,products) => {
    const orderProducts = order.products.map((prod) => {
        return {prodId: prod._id, packages: prod.packages}
    })
    
    //*We will save the sorted prods in an array
    const sortedProducts = []
    
    //*Iterate over the requested order products
    orderProducts.forEach(element => {
        //*For each product we search for equility in DB by ID so we can acces
        //*to the price based on size for each product
        const prodFound = products.find(prod => {
            return prod._id.equals(element.prodId)
        })
        if(!prodFound){
            return
        }
        //*Bubble sort algorithm
        prodFound.price.forEach((price, idx) => {
            //*If next element of prices in product found from DB is undefined
            //*Then we are in the last element, finish algorithm
            if(prodFound.price[idx+1] === undefined){
                return
            }
            
            //*If package from actual index is bigger than the next package size
            if(price.packageSize > prodFound.price[idx+1].packageSize) {
                //*We swap actual product price with next product price
                prodFound.price[idx] = prodFound.price[idx+1].packageSize
            }
        })

        const mixProducts = []
        if(prodFound.mix.isMix){
            prodFound.mix.products.forEach((strain) => {
               let mixProd = products.find((prod) => prod._id.equals(strain.strain))
               
                mixProd.price.forEach((prc, idx) => {
                    //*If next element of prices in product found from DB is undefined
                    //*Then we are in the last element, finish algorithm
                    if(mixProd.price[idx+1] === undefined){
                        return
                    }
                    
                    //*If package from actual index is bigger than the next package size
                    if(prc.packageSize > mixProd.price[idx+1].packageSize) {
                        //*We swap actual product price with next product price
                        mixProd.price[idx] = mixProd.price[idx+1].packageSize
                    }
                })
                sortedProducts.push(mixProd)
            })
        }
        //*Insert sorted products prices in reference
        return sortedProducts.push(prodFound)
    });
    
    return sortedProducts
}

export const getOrdersPrice = (order, products) => {
    //*Filter unnecesary data from prods object
    const orderProducts = order.products.map((prod) => {
        return {prodId: prod._id, packages: prod.packages}
    })
    /* 
    *Exists the posibility that the DB return or save the prices unsorted
    we need the prices sorted by package size so we can make a reference based 
    its index, from small to large package size, then package[0] must the smaller available
    */
   const sortedProducts = sortProductsPrices(order, products)
    
    //*Iterate and mutate the order products to make calculation based on each package
    const calculatedTotals = orderProducts.map((prod) => {
        const dbSortedProd = sortedProducts.find((fprod) => fprod._id.equals(prod.prodId))
        //*If we found the actual product in the sorted array from DB then
        if(dbSortedProd){
            //*Iterate over the product order packages
            prod.packages.forEach((pkg, idx) => {
                switch(pkg.size){
                    //*we have 2 types of sizes and with the sorted products we can access based on index
                    case "small":
                        //*Total per product will be the number of determined package size
                        //* multiplied by amount(price) of corresponding size y productFromDB
                        prod.packages[idx] = {...prod.packages[idx], total: dbSortedProd.price[0].amount * pkg.number}
                        break;
                    case "medium":
                        prod.packages[idx] = {...prod.packages[idx], total: dbSortedProd.price[1].amount * pkg.number}
                        break;
                }
            })

            return prod
        }
        
    })

    //*Now we have the total per package
    //*Iterate over the products now with totals per package
    const finalTotalPerProd = calculatedTotals.map((prodwithtotal) => {
        //*Reduce the totals per package to a total per product
        const finalTotal = prodwithtotal.packages.reduce((prev, curr, idx) => {
            return prev + curr.total
        },0)

        return {...prodwithtotal, total: finalTotal}
    })
    
    //*Reduce finalTotalPerProd to a total per order
    const orderTotal = finalTotalPerProd.reduce((prev, curr, idx) => {
        return prev + curr.total
    }, 0)
    //*RETURN ORDER TOTAL
    return orderTotal
}


export const newOrderDateValidation = (order, allProducts = undefined) => {
    const deliveryDateLeftDays = parseInt(((((new Date(order.date) - new Date())/1000)/60)/60)/24)
    
    if(deliveryDateLeftDays < 7) {
        throw new Error("Invalid date, must be a delivery date after the total production times.")
    }

    const completeObjectProducts = order.products.map((orderProduct) => allProducts.find((dbProduct) => dbProduct._id.equals(orderProduct._id)))

    const times = completeObjectProducts.flatMap((product) => {
        if(product.mix.isMix){
            const mixProductsCompleteObjects = product.mix.products.map((mixProd) => allProducts.find((dbProd) => dbProd._id.equals(mixProd.strain)))

            const mixTimes = mixProductsCompleteObjects.map((mixProd) => mixProd.parameters.day + mixProd.parameters.night)

            return mixTimes
        }
        return product.parameters.day + product.parameters.night
    })

    console.log(deliveryDateLeftDays)
    console.log(times)

    const maxTime = Math.max(...times)

    
    if(deliveryDateLeftDays < maxTime){
        throw new Error("Invalid date, must be a delivery date after the total production times.")
    }
} 

export const updateAllOrders = async (orgId, update) => {
    try {
        const result = await updateManyOrders({"_id":orgId}, update)
        // await updateProductionWithOrderUpdate()
        return result
    } catch (err) {
        throw new Error(err)
    }
}

export const groupOrdersByDate = (orders, date=undefined, outputFormat = undefined) => {
    const hash = {}, result = [] 
    let useOrderDate = true
    if(date !== undefined) {
        orders = orders.filter((order) => areSameDay(order.date, date))
        useOrderDate = false
    }

    if(date === undefined) {
        useOrderDate = true
    }        
    
    orders.forEach((order) => {
        if(useOrderDate) {
            if(!hash[`${order.date.getDate()}-${order.date.getMonth()+1}-${order.date.getFullYear()}`]){
                hash[`${order.date.getDate()}-${order.date.getMonth()+1}-${order.date.getFullYear()}`] = {
                  ...order.toObject()  
                }        
                result.push({[`${order.date.getDate()}-${order.date.getMonth()+1}-${order.date.getFullYear()}`]:hash[`${order.date.getDate()}-${order.date.getMonth()+1}-${order.date.getFullYear()}`]})
            }
        } else {
            if(!hash[date]){
                hash[date] = {
                  ...order.toObject()  
                }        
                result.push({[`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`]:hash[date]})
            }
        }
        
    })

    if(outputFormat === "hash"){
        return hash
    }
    
    return result
}

export const groupOrdersForPackaging = (orders, date=undefined) => {
    const hash = {}, result = []
    orders.forEach((order) => {
        order.products.forEach((product) => {
            if(!hash[product.name]){
                hash[product.name] = {
                    "packages": {
                        "small":0,
                        "medium":0,
                        "large":0
                    }
                } 
                result.push({[product.name]:hash[product.name]})
            }
            
            product.packages.forEach((pkg) => {
                hash[product.name].packages[pkg.size] +=+ pkg.number
            })
            
        })
        
    })
    return result
}

export const groupOrders = (criteria, orders, groupValue) => {
    let grouppedOrders
    if(criteria === "date"){
        if(groupValue !== undefined) {
            grouppedOrders = groupOrdersByDate(orders, groupValue)
        }
        
        if(groupValue === undefined) {
            grouppedOrders = groupOrdersByDate(orders)
        }
        
    }

    return grouppedOrders
}