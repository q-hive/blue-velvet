import React, {context, createContext, useEffect, useState} from 'react'
import { globalTimeModel, tasksCicleObj } from '../utils/models.js'
const WorkingContext = createContext()

const WorkingContextWrapper = ({children}) => {
    const [TrackWorkModel, setTrackWorkModel] = useState(JSON.parse(window.localStorage.getItem("TrackWorkModel")) || globalTimeModel)
    const [WorkContext, setWorkContext] = useState(JSON.parse(window.localStorage.getItem("WorkContext")) || tasksCicleObj)
    const [employeeIsWorking, setEmployeeIsWorking] = useState(JSON.parse(window.localStorage.getItem("isWorking")) || false)

    // useEffect(() => {
    //     window.localStorage.setItem("WorkContext", JSON.stringify(WorkContext))
    // }, [WorkContext])
    return(
        <WorkingContext.Provider value={{TrackWorkModel, WorkContext, setWorkContext, employeeIsWorking, setEmployeeIsWorking}}>
            {children}
        </WorkingContext.Provider>
    )
}

export {WorkingContext, WorkingContextWrapper}