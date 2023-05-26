import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { BV_THEME } from '../../../../theme/BV-theme'

const options = [ 
    {
        type:"short",
        day:"4",
        night:"3"
    }, 
    {
        type:"large",
        day:"3",
        night:"7"
    } 
]

export const ProductsTime = ({productData, setProductData}) => {
    const handleSetTime = (e,v,r) => {
        switch(r){
            case "selectOption":
                setProductData({
                    ...productData,
                    day:v.day,
                    night:v.night,
                    cycleType:v.type
                })
                break;
            case "clear":
                setProductData({
                    ...productData,
                    day:undefined,
                    night:undefined,
                    cycleType:""
                })
                break;
            default:
                break;
        }
    }
    
  return (
    <Autocomplete
        sx={BV_THEME.input.mobile.fullSize.desktop.fullSize}
        value={{day:productData.day, night:productData.night, type:productData.cycleType}}
        options={options}
        onChange={handleSetTime}
        renderInput={(params) => {
            return <TextField {...params} label="Select the cycle"/>
        }}
        getOptionLabel={(o) => {
            return o.type
        }}
        isOptionEqualToValue={(o,v) => {
            if(v.type === "") {
                return true
            }
            return o.type === v.type
        }}
    />
  )
}
