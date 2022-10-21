import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import useInterval from './useInterval';
import useWorkingContext from '../contextHooks/useEmployeeContext';


export const Timer = ({contxt, from}) => {
  const {TrackWorkModel, WorkContext} = useWorkingContext()
  const getCurrentContextTime = (context) => {
    let currentContextTime = 0;
    if(context === "global"){
      currentContextTime = (Date.now()) - (TrackWorkModel.started)
    }
  
    if(context === "task" && from != undefined){
      const actualTask = Object.keys(WorkContext.cicle)[WorkContext.current]
      currentContextTime = from - WorkContext.cicle[actualTask].started
    }
    
    return currentContextTime
  }

  
    const [time, setTime] = useState(getCurrentContextTime(contxt) || 0);
    
    const updateTime = () => {
      setTime(time+1000)
    }
    function addZero(i) {
      if (i < 10) {i = "0" + i}
      return i;
    }
    let h = addZero(Math.floor((time/(60000*60))%60));
    let m = addZero(Math.floor((time/60000)%60));
    let s = addZero(Math.floor((time/1000)%60));
    
    let formattedTime = h + ":" + m + ":" + s;
    
    useInterval(updateTime, 1000)

  return (
    <Typography>Current {contxt === 'global' ? 'working' : 'task'} time: {formattedTime}</Typography>
  )
}
