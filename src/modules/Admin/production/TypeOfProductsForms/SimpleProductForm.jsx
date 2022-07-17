import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'

export const SimpleProductForm = () => {
    const [stepBtnLabel, setStepBtnLabel] = useState("Done")
    const [showTimes, setShowTimes] = useState(false)

    const handleComplete = () => {
        if(!showTimes){
            setShowTimes(!showTimes)
            setStepBtnLabel("Set product")
        }
    }
  return (
    <div>
        {
            showTimes
            ?
            <>
                <TextField type="number" label="Dark time" />
                <TextField type="number" label="Light time" />
            </>
            :
            <>
                <TextField label="Product name"/>
                <TextField label="Product label"/>
                <TextField label="Seeding"/>
                <TextField label="Harvest"/>
                <TextField label="Cost"/>
                <TextField label="Email / route"/>
            </>

        }
        <Button variant="contained" onClick={handleComplete}>{stepBtnLabel}</Button>
    </div>
  )
}
