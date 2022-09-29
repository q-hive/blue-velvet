import React, { useState, useEffect, useRef } from 'react'
import { Typography } from '@mui/material'

function useInterval(cb, delay) {
  const savedCallBack = useRef();

  useEffect(() => {
    savedCallBack.current = cb;
  });

  useEffect(() => {
    function tick() {
      savedCallBack.current();
    }

    let timerId = setInterval(tick,delay)
    
    return () => clearInterval(timerId)
  }, []);
}

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
    <Typography>Elapsed Time {formattedTime}</Typography>
  )
}
