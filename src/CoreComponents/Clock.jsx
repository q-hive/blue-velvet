import React, { useEffect, useState, useRef } from 'react'

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

export const Clock = ({withTimer}) => {
    const [time, setTime] = useState(new Date())
    const normalizeDate = (date) => {
        let newDate

        //*HH:MM:SS
        newDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                    
        
        return newDate
    }

    
    useInterval(() => {
        setTime(() => {
            return ( new Date() )
        })
    },1000)
  return (
    <Typography color="primary">
        {normalizeDate(time)}
    </Typography>
  )
}
