import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import useInterval from './useInterval';
import useWorkingContext from '../contextHooks/useEmployeeContext';


export const Timer = ({contxt}) => {
  const {TrackWorkModel, WorkContext, employeeIsWorking} = useWorkingContext()
  let currentTaskFinished = false
  const getCurrentContextTime = (context) => {
    let currentContextTime = 0;
    if(context === "global"){
      currentContextTime = (Date.now()) - (TrackWorkModel.started)
    }
    
    if(context === "task"){
      let from = WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]]?.stopped
      const actualTask = Object.keys(WorkContext.cicle)[WorkContext.current]
      if(from){
        currentContextTime = from - WorkContext.cicle[actualTask].started
      }
      currentTaskFinished = (employeeIsWorking) && (WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].achieved !== undefined)
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
  function formatTime(value){
    let h = addZero(Math.floor((value/(60000*60))%60));
    let m = addZero(Math.floor((value/60000)%60));
    let s = addZero(Math.floor((value/1000)%60));
      
    let formattedTime = h + ":" + m + ":" + s;
    return formattedTime
  }


  
  
  useEffect(() => {
    setTime(() => {
      return getCurrentContextTime(contxt)
    })
  }, [WorkContext.current])
    
  
  if(currentTaskFinished){
    return (
      <Typography>Achieved time: {formatTime(WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].achieved)}</Typography>
      )
  }
    
    useInterval(updateTime, 1000)  
  return (
    <Typography>Current {contxt === 'global' ? 'working' : 'task'} time: {formatTime(time)}</Typography>
  )
}
