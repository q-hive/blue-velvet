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
        "soaking1": {...taskPerformanceModel, name:"PreSoaking"},
        "soaking2": {...taskPerformanceModel, name:"PreSoaking"},
        "harvestReady": {...taskPerformanceModel, name:"Harvest"},
        "packing": {...taskPerformanceModel, name:"Packing"},
        "ready": {...taskPerformanceModel, name:"Delivery"},
        "seeding": {...taskPerformanceModel, name:"Waste and control"},
        "growing": {...taskPerformanceModel, name:"Waste and control"},
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
        // "harvested": {
        //    "name": "TaskName", 
        //    "expected": "", 
        //    "achieved": "", 
        //    "production": "", 
        //    "workingOrders": "", 
        //    "breaks": "", 
        // },
        //"ready": {...taskPerformanceModel, name:"Delivery"},
        //"cleaning": {...taskPerformanceModel, name:"Cleaning"},
        //"mats":{...taskPerformanceModel, name:"Mats"},
    },
    "current": 0,
    "currentRender":0
    
}