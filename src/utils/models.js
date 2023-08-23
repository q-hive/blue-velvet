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
    "type": "",
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
        "preSoaking": {...taskPerformanceModel, name:"PreSoaking", type: "preSoaking"},
        "harvestReady": {...taskPerformanceModel, name:"Harvest", type: "harvestReady"},
        "packing": {...taskPerformanceModel, name:"Packing", type: "packing"},
        "ready": {...taskPerformanceModel, name:"Delivery", type: "ready"},
        "seeding": {...taskPerformanceModel, name:"Waste and control", type: "seeding"},
        "cleaning": {...taskPerformanceModel, name:"Cleaning", type: "cleaning"},
        "growing": {...taskPerformanceModel, name:"Waste and control", type: "growing"},
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
        //"mats":{...taskPerformanceModel, name:"Mats"},
    },
    "current": 0,
    "currentRender":0
    
}

export const containerConfigModel = {
    "overhead":0
}