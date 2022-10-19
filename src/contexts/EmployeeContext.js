import React, {context, createContext, useState} from 'react'
import { globalTimeModel } from '../modules/Employee/Tasks/FullChamber'
const WorkingContext = createContext()

const WorkingContextWrapper = ({children}) => {
    const [TrackWorkModel, setTrackWorkModel] = useState(globalTimeModel)
    
    return(
        <WorkingContext.Provider value={{TrackWorkModel}}>
            {children}
        </WorkingContext.Provider>
    )
}

export {WorkingContext, WorkingContextWrapper}