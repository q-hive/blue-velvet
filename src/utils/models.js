export const globalTimeModel = {
    "workDay": new Date(),
    "started": undefined,
    "finished": undefined,
    "expected": undefined,
    "breaks": [],
    "tasks": []
}

const taskPerformanceModel = {
    "name": "",
    "started":undefined,
    "stopped": undefined,
    "expected": undefined,
    "achieved": undefined,
    "production": undefined,
    "workingOrders": [],
    "breaks": [],
}
export const tasksCicleObj = {
    "cicle": {
        "preSoaking": {...taskPerformanceModel, name:"PreSoaking"},
        "seeding": {...taskPerformanceModel, name:"Seeding"},
        // "pre-soaking": {
        //     "name": "TaskName",
        //     "elapsed":null,
        //     "expected": "",
        //     "achieved": "",
        //     "production": "",
        //     "workingOrders": "",
        //     "breaks": "",
        // },
        //"growing":{...taskPerformanceModel, name:"Growing microgreens"},
        "harvestReady": {...taskPerformanceModel, name:"Harvest"},
        // "harvested": {
        //    "name": "TaskName", 
        //    "expected": "", 
        //    "achieved": "", 
        //    "production": "", 
        //    "workingOrders": "", 
        //    "breaks": "", 
        // },
        "ready": {...taskPerformanceModel, name:"Delivery"},
        "cleaning": {...taskPerformanceModel, name:"Cleaning"},
        "mats":{...taskPerformanceModel, name:"Mats"},
    },
    "current": 0,
    "currentRender":0
    
}