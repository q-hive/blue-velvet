export const getKey = (status) => {
    const dflt = "seeding"
    
    const statusObj = {
        "preSoaking":"soaking",
        "seeding":"seeding",
        "harvestReady": "harvest",
        "mats":"cut mats",
        "growing":"growing",
        "cleaning":"cleaning",
        "packing":"packing",
        "ready":"delivery"
    }

    return statusObj[`${status?? dflt}`]
}

export const translationKeysByStatusLabel = {
    "soaking":"soaking_dlytask_title",
    "seeding":"seeding_dlytask_title",
    "harvest": "harvest_dlytask_title",
    "cut mats": "mats_dlytask_title",
    "growing":  "growing_status_dlytask_title",
    "cleaning": "cleaning_dlytask_title",
    "packing": "packing_dlytask_title",
    "delivery": "ready_status_dlytask_title"
}