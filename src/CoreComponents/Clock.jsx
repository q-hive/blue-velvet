import React, { useEffect, useState, useRef } from 'react'

import { Typography } from '@mui/material'
import useInterval from './useInterval'

export const Clock = ({withTimer}) => {
    const [time, setTime] = useState(new Date())
    
    function addZero(i) {
      if (i < 10) {i = "0" + i}
      return i;
    }

    const normalizeDate = (date) => {
        let newDate

        //*HH:MM:SS
        newDate = addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds())
                    
        
        return newDate
    }

    
    useInterval(() => {
        setTime(() => {
            return ( new Date() )
        })
    },1000)
  return (
    <Typography color="black">
        {normalizeDate(time)}
    </Typography>
  )
}
