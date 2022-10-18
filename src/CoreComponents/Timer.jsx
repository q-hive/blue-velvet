import React, { useState } from 'react'
import { Typography } from '@mui/material'
import useInterval from './useInterval';

export const Timer = ({contxt}) => {
    const [time, setTime] = useState(0);
    const updateTime = () => {
      setTime(time+1000)
    }
    function addZero(i) {
      if (i < 10) {i = "0" + i}
      return i;
    }
    let h = addZero(Math.floor((time/(60000*60))%60));
    let m = addZero(Math.floor((time/60000)%60));
    let s = addZero((time/1000)%60);
    
    let formattedTime = h + ":" + m + ":" + s;
    
    useInterval(updateTime, 1000)
  return (
    <Typography>Current {contxt === 'global' ? 'working' : 'task'} time: {formattedTime}</Typography>
  )
}
