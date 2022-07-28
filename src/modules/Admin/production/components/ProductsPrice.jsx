import { Autocomplete, Box, TextField } from '@mui/material'
import React from 'react'

export const ProductsPrice = ({productData, handleChangeProductData,setSelectedPackage,selectedPackage, editing, error}) => {
    const getDefaultPrice = (packages) => {
        //*PACKAGE IS A RESERVED WORD IN STRICT MODE
        return packages.find(pack => pack.packageSize === selectedPackage)
    }

    const handleSelectPackage = (v) => {
        setSelectedPackage(v)
    }
    
  return (
    <Box sx={{display:"flex"}}>
        <TextField disabled={!selectedPackage} defaultValue={editing ? getDefaultPrice(productData.price).amount : undefined} helperText={error.price.message} error={error.price.failed} id="price" onChange={handleChangeProductData} label="Price" sx={{width:"30%"}}/>
        <Autocomplete
            sx={{width:"70%"}}
            options={productData.price}
            renderInput={(params) => {
                return <TextField {...params} label="Package size (grs)"/>
            }}
            getOptionLabel={(opt) => `${opt.packageSize}`}
            onChange={(e,v,r) => {
                switch(r){
                    case "selectOption":
                        handleSelectPackage(v)
                        break;
                    default:
                        break;
                }
            }}
            isOptionEqualToValue={(o, v) => {
                return o.packageSize === v.packageSize
            }}
        />
    </Box>
  )
}
