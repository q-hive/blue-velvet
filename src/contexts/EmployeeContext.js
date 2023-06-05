import React, {context, createContext, useEffect, useState} from 'react'
import { globalTimeModel, tasksCicleObj } from '../utils/models.js'
const WorkingContext = createContext()

const WorkingContextWrapper = ({children}) => {
    const [TrackWorkModel, setTrackWorkModel] = useState(JSON.parse(window.localStorage.getItem("TrackWorkModel")) || globalTimeModel)
    const [WorkContext, setWorkContext] = useState(JSON.parse(window.localStorage.getItem("WorkContext")) || tasksCicleObj)
    const [employeeIsWorking, setEmployeeIsWorking] = useState(JSON.parse(window.localStorage.getItem("isWorking")) || false)
    const [state, setState] = useState({
        orders: [],
        workData: {},
        packs: {},
        cycleKeys: {},
        time: 0,
      })
    //*Time
    const [isOnTime, setIsOnTime] = useState(true)
    
    useEffect(() => {
        console.log("Change in WorkContext")
        window.localStorage.setItem("WorkContext", JSON.stringify(WorkContext))
    }, [WorkContext])
    
    useEffect(() => {
        window.localStorage.setItem("isWorking", `${employeeIsWorking}`)
    }, [employeeIsWorking])
    
    useEffect(() => {
        //*SET THE TRACKMODEL IN LOCALSTORAGE
        if (TrackWorkModel.workDay instanceof Date) {
            let x = new Date()
            let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60
            let minutesDiff = x.getHours() - x.getTimezoneOffset() % 60
            TrackWorkModel.workDay.setHours(hoursDiff)
            TrackWorkModel.workDay.setMinutes(minutesDiff)
        }
        window.localStorage.setItem("TrackWorkModel", JSON.stringify(TrackWorkModel))
    }, [TrackWorkModel])
    return(
        <WorkingContext.Provider value={{TrackWorkModel,setTrackWorkModel, WorkContext, setWorkContext, employeeIsWorking, setEmployeeIsWorking, isOnTime, setIsOnTime, state, setState}}>
            {children}
        </WorkingContext.Provider>
    )
}

export {WorkingContext, WorkingContextWrapper}