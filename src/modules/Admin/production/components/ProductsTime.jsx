import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { BV_THEME } from '../../../../theme/BV-theme'

const createOption = (type, day, night) => {
    return {
        type: type,
        day: day,
        night: night,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} cycle (${day} days and ${night} nights)`
    };
}

const options = [
    createOption('short', '4', '3'),
    createOption('large', '3', '7')
];

export const ProductsTime = ({productData, setProductData}) => {
    const handleSetTime = (e,v,r) => {
        switch(r){
            case "selectOption":
                setProductData({
                    ...productData,
                    day:v.day,
                    night:v.night,
                    cycleType:v.type,
                    message:v.message
                })
                break;
            case "clear":
                setProductData({
                    ...productData,
                    day:undefined,
                    night:undefined,
                    cycleType:"",
                    message:""
                })
                break;
            default:
                break;
        }
    }
    
  return (
    <Autocomplete
        sx={BV_THEME.input.mobile.fullSize.desktop.fullSize}
        value={{day:productData.day, night:productData.night, type:productData.cycleType, message:productData.message}}
        options={options}
        onChange={handleSetTime}
        renderInput={(params) => {
            return <TextField {...params} label="Select the cycle"/>
        }}
        getOptionLabel={(o) => {
            return o.message
        }}
        isOptionEqualToValue={(o,v) => {
            if(v.message === "") {
                return true
            }
            return o.type === v.type
        }}
    />
  )
}
