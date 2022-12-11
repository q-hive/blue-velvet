import React, {context, createContext, useEffect, useState} from 'react'
import { globalTimeModel, tasksCicleObj } from '../utils/models.js'
const WorkingContext = createContext()

const WorkingContextWrapper = ({children}) => {
    const [TrackWorkModel, setTrackWorkModel] = useState(JSON.parse(window.localStorage.getItem("TrackWorkModel")) || globalTimeModel)
    const [WorkContext, setWorkContext] = useState(JSON.parse(window.localStorage.getItem("WorkContext")) || tasksCicleObj)
    const [employeeIsWorking, setEmployeeIsWorking] = useState(JSON.parse(window.localStorage.getItem("isWorking")) || false)

    useEffect(() => {
        console.log("Change in WorkContext")
        window.localStorage.setItem("WorkContext", JSON.stringify(WorkContext))
    }, [WorkContext])

    useEffect(() => {
        window.localStorage.setItem("isWorking", `${employeeIsWorking}`)
    }, [employeeIsWorking])

    useEffect(() => {
        //*SET THE TRACKMODEL IN LOCALSTORAGE
        window.localStorage.setItem("TrackWorkModel", JSON.stringify(TrackWorkModel))
    }, [TrackWorkModel])
    return(
        <WorkingContext.Provider value={{TrackWorkModel,setTrackWorkModel, WorkContext, setWorkContext, employeeIsWorking, setEmployeeIsWorking}}>
            {children}
        </WorkingContext.Provider>
    )
}

export {WorkingContext, WorkingContextWrapper}