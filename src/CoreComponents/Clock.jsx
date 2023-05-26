import React, { useEffect, useState, useRef } from 'react'

import { Typography } from '@mui/material'
import useInterval from './useInterval'
import { normalizeDate } from '../utils/times'

export const Clock = ({withTimer,color}) => {
    const [time, setTime] = useState(new Date())
    
    useInterval(() => {
        setTime(() => {
            return ( new Date() )
        })
    },1000)
  return (
    <Typography color={color || "black"} >
      <b><i>{normalizeDate(time)}</i></b>
    </Typography>
  )
}
