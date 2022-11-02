import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import useInterval from './useInterval';
import useWorkingContext from '../contextHooks/useEmployeeContext';



export const Timer = ({contxt}) => {
  const {TrackWorkModel, WorkContext, employeeIsWorking} = useWorkingContext()
  
  const [time, setTime] = useState(0);
  
  let currentTaskFinished = (employeeIsWorking) && (WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.currentRender]].achieved !== undefined) || false

  const getCurrentContextTime = (context) => {
    let currentContextTime = 0;
    
    if(context === "global"){
      currentContextTime = (Date.now()) - (TrackWorkModel.started)
    }
    
    if(context === "task"){

      const actualTask = Object.keys(WorkContext.cicle)[WorkContext.currentRender]
      const workingOnThisTask = WorkContext.current === WorkContext.currentRender


      if(WorkContext.current > WorkContext.currentRender ){
        currentContextTime=WorkContext.cicle[actualTask].achieved
      }

      if(workingOnThisTask)
        currentContextTime=Date.now() - WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.current]].started
    }

    return currentContextTime
  }


  
    
  const updateTime = () => {
    if(!currentTaskFinished && WorkContext.current === WorkContext.currentRender || contxt == "global" )
      setTime(time+1000)
    
    if(WorkContext.current < WorkContext.currentRender && contxt != "global" )
      setTime(0)

  }

  


  
  
  useEffect(() => {
    setTime(() => {
      return getCurrentContextTime(contxt)
    })
  }, [WorkContext.currentRender])
    
  useInterval(updateTime, 1000)  
  
  if(currentTaskFinished && contxt != "global"){
    return (
      <Typography>Achieved time: {formatTime(WorkContext.cicle[Object.keys(WorkContext.cicle)[WorkContext.currentRender]].achieved)}</Typography>
      )
  }
    
     
      return (
      <Typography>Current {contxt === 'global' ? 'working' : 'task'} time: {formatTime(time)}</Typography>
    )
}

export function formatTime(value){
  function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  
  let h = addZero(Math.floor((value/(60000*60))%60));
  let m = addZero(Math.floor((value/60000)%60));
  let s = addZero(Math.floor((value/1000)%60));
    
  let formattedTime = h + ":" + m + ":" + s;
  return formattedTime
}
