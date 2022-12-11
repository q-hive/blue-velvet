import { Euro } from '@mui/icons-material'
import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import { BV_THEME } from '../../../../theme/BV-theme'

export const ProductsPrice = ({productData, handleChangeProductData,editing,editValues,error, mix}) => {

     
    return (
    <Box sx={{display:"flex", width:"100%"}}>
        <TextField 
            id="25"   
            type="number" 
            InputProps={
                {
                    startAdornment: <InputAdornment position="start"><Euro/></InputAdornment>
                }
            } 
            value={productData.smallPrice}
            defaultValue={editing ? 
                mix ?  editValues[0].amount 
                : productData.smallPrice 
        : ""} 
            helperText={error.smallPrice.message} 
            error={error.smallPrice.failed} 
            onChange={mix ? (e) => handleChangeProductData(e,e.target.value,"input") : handleChangeProductData} 
            label="Price - 25grs"   
            sx={BV_THEME.input.mobile.halfSize.desktop.halfSize}
        />
        <TextField 
            id="80"   
            type="number" 
            InputProps={
                {
                    startAdornment: <InputAdornment position="start"><Euro/></InputAdornment>
                }
            } 
            value={productData.mediumPrice} 
            defaultValue={  editing ? 
                                    mix ?  editValues[1].amount 
                                    : productData.mediumPrice 
                            : ""} 
            helperText={error.mediumPrice.message} 
            error={error.mediumPrice.failed} 
            onChange={mix ? (e) => handleChangeProductData(e,e.target.value, "input") : handleChangeProductData} 
            label="Price - 80grs"   
            sx={BV_THEME.input.mobile.halfSize.desktop.halfSize}
        />
        {/* <TextField 
            id="1000" 
            type="number" 
            InputProps={
                {
                    startAdornment: <InputAdornment position="start"><Euro/></InputAdornment>
                }
            } 
            value={productData.largePrice} 
            defaultValue={editing ? productData.largePrice : undefined} 
            onChange={handleChangeProductData} 
            label="Price - 1000grs" 
            sx={BV_THEME.input.mobile.halfSize.desktop.halfSize}
        /> */}
    </Box>
  )
}
