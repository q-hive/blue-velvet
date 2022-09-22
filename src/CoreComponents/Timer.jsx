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
    
    useInterval(updateTime, 1000)
  return (
    <Typography>Current {contxt} time: {Math.floor((time/(60000*60))%60)}:{Math.floor((time/60000)%60)}:{Math.floor((time/1000)%60)}</Typography>
  )
}
