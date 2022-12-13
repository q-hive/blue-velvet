import React, { useEffect, useState } from 'react'

//*MUI Components
    // import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Fade, IconButton, Stack, Typography } from '@mui/material'

//*UTILS

//*NETWORK
import api from "../../../../axios"

//THEME
import { BV_THEME } from '../../../../theme/BV-theme'
import useAuth from '../../../../contextHooks/useAuthContext'
import useWorkingContext from '../../../../contextHooks/useEmployeeContext';
import { QuestionMark } from '@mui/icons-material'
import { UserDialog } from '../../../../CoreComponents/UserFeedback/Dialog'

const taskCard_sx = {
    display:"flex",
    width:"100%", 
    justifyContent:"center",
    marginTop:"5vh", 
    flexDirection:"column",
    alignItems:"center"
}


export const PreSoakingContent = (props) => {

    const {user, credential} = useAuth()
    const [workProducts, setWorkProducts] = useState(props.workData /*.production.products*/)
    const [dialog, setDialog] = useState({
        open:false,
        title:"",
        content:"",
        children:null,
        actions:[{label:"Close", execute:()=> setDialog({...dialog, open:false})}]
    })
    
    const {TrackWorkModel} = useWorkingContext()

    function sumAllTrays() {
        let i;
        let trays = 0;

        for (i = 0; i < Object.keys(workProducts).length; i++) {
          if(workProducts[i].trays != undefined)
            trays += Math.ceil(workProducts[i].trays)
        }
        
        return trays;
      }
    
    const handleHelpDialog = () => {
        setDialog({
            ...dialog,
            open:true,
            title:"Additonal information about Soaking task",
            content:"No additional info.",
            children:() => (
                <>
                    <Typography variant="h4" align='center' color="secondary">
                        Gather what you need: <br /><br/>
                    </Typography>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        {workProducts.length} buckets <br></br>Water
                    </Typography>
                </>
            ) 
        })
    }
      

    if(props.index===0)
        return (
            <>
                <Box sx={taskCard_sx}>
                    {/* //*Show items needed for task */}
                    {/* <Typography variant="h4" align='center' color="secondary">
                        Gather what you need: <br /><br/>
                    </Typography>
                    <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                        {workProducts.length} buckets <br></br>Water
                    </Typography> */}

                    {
                        workProducts.length > 0 && (
                            workProducts.map((product,index)=>{
                                return(
                                    <Typography key={index} variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                                        <b>{parseFloat(product?.seeds/1000 || 0).toFixed(5)}</b> KG of <b>{product?.ProductName || ''}</b> Seeds <br/>
                                        <br></br>
                                    </Typography>
                            )})
                        ) 
                    }

                    <Box sx={taskCard_sx}>
                        <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                            <strong>{workProducts.length === 0 ? ' At the moment there are no products that need to be soak. ' : 'Put the indicated amount of seeds in each bucket and wash it twice.'}</strong>
                        </Typography>
                    </Box>

                    <Box sx={taskCard_sx}>
                        {
                        workProducts.length > 0 && (
                            <Typography variant="h5" align='center' color={BV_THEME.textColor.lightGray}>
                                    Change the water after 6 hrs, wash before seeding.
                            </Typography>
                        )
                        }
                    </Box>


                    
                    <IconButton onClick={handleHelpDialog} >

                        <QuestionMark/>

                    </IconButton>

                    <UserDialog dialog={dialog} setDialog={setDialog} open={dialog.open} title={dialog.title} content={dialog.content} actions={dialog.actions} children={dialog.children}/>

                </Box>

            </>
        );

    {/*if(props.index===1){
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
    )*/}

}