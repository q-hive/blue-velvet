import React, {context, createContext, useState} from 'react'
import { globalTimeModel } from '../utils/models.js'
const WorkingContext = createContext()

const WorkingContextWrapper = ({children}) => {
    const [TrackWorkModel, setTrackWorkModel] = useState(JSON.parse(window.localStorage.getItem("TrackWorkModel")) || globalTimeModel)
    
    return(
        <WorkingContext.Provider value={{TrackWorkModel}}>
            {children}
        </WorkingContext.Provider>
    )
}

export {WorkingContext, WorkingContextWrapper}