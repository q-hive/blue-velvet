
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

export const getEstimatedHarvestDate = (product) => {
    try {
        const lightTime = product.parameters.day
        const darkTime = product.parameters.night
        const estimatedTime = Date.now() + (((((lightTime*24)*60)*60)*1000) + ((((darkTime*24)*60)*60)*1000))
    
        const estimatedDate = new Date(estimatedTime)  
        estimatedDate.setHours(4,0,0)  

        return estimatedDate
    } catch (err) {
        throw Error("Error getting estimation for harvesting date")
    }
}

export const getOrderProdData = (order, dbproducts, perProduct = false) => {
    //*SORT PRICES IN DBPRODUCTS
    // const sortedProductPrices = sortProductsPrices(order, dbproducts)
    //*Add grams per size to order product packages
    order.products.forEach((prod, pidx) => {
        //*Find the product in database
        const prodFound = dbproducts.find((fprod) => fprod._id.equals(prod._id))
        prod.packages.forEach((pkg, idx) => {
            switch(pkg.size){
                case "small":
                    prod.packages[idx] = {
                        ...prod.packages[idx],
                        number:pkg.number, 
                        grams: prodFound.price[0].packageSize * pkg.number,
                    }
                    break;
                case "medium":
                    prod.packages[idx] = {
                        ...prod.packages[idx], 
                        number:pkg.number,
                        grams: prodFound.price[1].packageSize * pkg.number
                    }
                    break;
                default:
                    break;
            }
        })
        
        //*Total grams will define number of trays based on seedingRate
        const harvest = prod.packages.reduce((prev, curr) => {
            return prev + curr.grams
        },0)

        if(prodFound){
            if(prodFound.mix.isMix){
                
                prod.mix = {isMix: true}
                const mixProds = prodFound.toObject().mix.products
                
                const mappedMixComposition = mixProds.map((mprod) => {
                    
                    const mixFound = dbproducts.find((fprod) => fprod._id.equals(mprod.strain)).toObject()
                    const mixProductHarvestDate = getEstimatedHarvestDate(mixFound)
                    
                    delete mixFound.mix
                    delete mixFound.price
                    delete mprod.strain
                    mixFound.productionData = {
                        ProductName:            mixFound.name,
                        ProductionStatus:       "seeding",
                        ProductionOrder:        order._id,
                        EstimatedHarvestDate:   mixProductHarvestDate,
                        ProductID:              mixFound._id,
                        harvest:                harvest * (mprod.amount/100),
                        seeds:                  harvest * (mixFound.parameters.seedingRate/mixFound.parameters.harvestRate),
                        trays:                  (harvest * (mixFound.parameters.seedingRate/mixFound.parameters.harvestRate)) / mixFound.parameters.seedingRate
                    }

                    return {...mprod, ...mixFound, mix:true}
                })

                prod.products = mappedMixComposition
                prod.productionData = mappedMixComposition.map((productOfMix) => productOfMix.productionData)
                
            } else {
                prod.mix = {isMix: false}
                //* Get seedingRate (in grams) per tray
                prod["seedingRate"] = prodFound.parameters.seedingRate
                //* Get harvestRate (in grams) per tray
                prod["harvestRate"] = prodFound.parameters.harvestRate
                prod["productionData"] = [{
                        ProductName:            prodFound.name,
                        ProductionStatus:       "seeding",
                        ProductionOrder:        order._id,
                        ProductID:              prodFound._id,
                        EstimatedHarvestDate:   getEstimatedHarvestDate(prodFound)
                }]

            }
        }
        
        // const seeds = harvest / (prod.harvestRate / prod.seedingRate)
        // const trays = seeds / prod.seedingRate
        
        // prod["productionData"] = [{...prod.productionData, harvest, seeds, trays}]
    })

    // if(perProduct){
    //     let productionData

    //     productionData = order.products.flatMap((prod) => {
    //         if(prod.mix){
    //             return prod.products.map((mxprod) => {
    //                 return {
    //                     ...mxprod.productionData, 
    //                     ProductID:mxprod._id,
    //                     mixId:prod._id,
    //                     mix:true
    //                 }
    //             })
    //         }
            
    //         return {...prod.productionData, id:prod._id}
    //     })
        
    //     return productionData
    // }
    
    const productionData = order.products.flatMap((prod) => {
        // if(prod.mix.isMix){
        //     const mappedProducionData = prod.products.map((mxprod) => {
        //         return {product:mxprod.name, ...mxprod.productionData}
        //     })

        //     return mappedProducionData
        // }
        return prod.productionData
    })

    
    return productionData
}