import React, { useEffect, useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, Stack, Typography } from '@mui/material'

//*UTILS

//*NETWORK
import api from "../../../../axios"

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import useAuth from '../../../../contextHooks/useAuthContext'

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}


export const SeedingContent = (props) => {

    const {user, credential} = useAuth()
    const [workProducts, setWorkProducts] = useState([])

    function sumAllTrays() {
        let i;
        let trays = 0;

        for (i = 0; i < workProducts.length; i++) {
            console.log(workProducts[i])
          if(workProducts[i].productData.trays != undefined)
            
            trays += Math.ceil(workProducts[i].productData.trays)
        }
        
        return trays;
      }

    //   function uniqueByName(items) {
    //     const set = new Set();
    //     return items.filter((item) => {
    //       const isDuplicate = set.has(item.productData.name);
    //       set.add(item.productData.name);
    //       return !isDuplicate;
    //     });
    //   }

      const getWorkData = async ()=> {
        const workData = await api.api.get(`${api.apiVersion}/work/production/634061756424d08c50e58841?container=633b2e0cd069d81c46a18033`,{
            headers:{
                "authorization":    credential._tokenResponse.idToken,
                "user":             user
            }
        })

        return workData
    }

    
    
    const totalTrays = sumAllTrays()

    console.log("work data",workProducts)
    console.log("tt",totalTrays)

    useEffect(() => {
        getWorkData()
        .then((data)=>{
            console.log("data",data)
            setWorkProducts(data.data.data.production.products)
        })
        .catch((err) => {
            console.log(err)
        })
        
        
    }, [])
    
    
    if(props.index===0)
        return (
            <>
                <Box sx={taskCard_sx}>
                    <Typography variant="h4" align='center' color="secondary">
                        Gather what you need: <br /><br/>
                    </Typography>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        <b>{totalTrays}</b> {totalTrays>1 ? "Trays": "Tray"} <br/> 
                    </Typography>
                    {workProducts.map((product,index)=>{return(
                        <Typography key={index} variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                            <b>{parseFloat(product.productData.seeds).toFixed(2)}</b> grs of <b>{product.productData.name}</b> Seeds <br/>
                        </Typography>
                    )})}

                    <Box sx={taskCard_sx}>
                        <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Place the {totalTrays} Trays on the Seeding-Table, and fill each of them with a pre-cut Hemp-Mat
                        </Typography>
                    </Box>

                    <Box sx={taskCard_sx}>
                        <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        Staple them under the Table.
                        </Typography>
                    </Box>


                    
                    
                </Box>

            </>
        );

    if(props.index===1){
        const getSeeds = (product) => {
            if(product.productionData === undefined){
                return parseFloat(product.seeds/product.trays).toFixed(2)
            }
            return parseFloat(product.productionData.seeds/product.productionData.trays).toFixed(2)
        }
    
        return (
        <>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Spread the seeds equally on the mats and softly spray them with the <i><b>triangle-spray.</b></i> <br/><br/>
                </Typography>

                
                <Stack  sx={{display:"flex",justifyContent:"space-between"}}>
                {
                    
                    workProducts.map((product,index)=>{
                        return( 
                            <Typography key={product+index+"2"} variant="h5" align='justify' color={BV_THEME.textColor.lightGray} >
                                <b>{product.productData.name}</b> <br/>{Math.ceil(product.productData.trays)} trays. Max seeds per tray:  <b>{getSeeds(product.productData)}</b> g <br/><br/>
                            </Typography>
                        )
                    })
                }

                <br/>
                </Stack>
            </Box>

        </>
        )
    } 

    if(props.index===2) 
    return (
        <>
            <Box sx={taskCard_sx}>
                <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                    Staple them slightly turned and bring them to the germination shelves.  
                </Typography>
            </Box>

        </>
    )

}