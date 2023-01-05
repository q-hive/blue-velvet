export function prepareProductionStatusesForRender (productionModels) {
    let psTrue = productionModels.preSoaking?.length>0
    let sTrue = productionModels.seeding?.length>0
    let hrTrue = productionModels.harvestReady?.length>0

    
    let testingKeys = Object.keys(productionModels) 
    //*Delete growing from cycle (not useful now top display in cycle)
    const growingStatusIndex = testingKeys.indexOf("growing")
    testingKeys.splice(growingStatusIndex, 1)
    
    testingKeys.push("cleaning")

    return testingKeys;
}