export const getKey = (status) => {
    const dflt = "seeding"
    
    const statusObj = {
        "preSoaking":"Soaking",
        "seeding":"seeding",
        "harvestReady": "harvest",
        "mats":"cut Mats",
        "growing":"growing",
        "cleaning":"cleaning",
        "packing":"packing",
        "ready":"delivery"
    }

    return statusObj[`${status?? dflt}`]
}