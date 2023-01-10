import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../contextHooks/useAuthContext';
import { BV_THEME } from '../../theme/BV-theme';
import { capitalize } from '../../utils/capitalize';
import { getKey } from '../../utils/getDisplayKeyByStatus';
import { transformTo } from '../../utils/times';
import { getWorkData } from '../requests';
import { prepareProductionStatusesForRender } from './methods/CycleKeysManagement';

const fixedHeightPaper = {
    padding: BV_THEME.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 240
}

export const DailyTasksCard = (props) => {
    const cycle = props.cycle;

    const timeObjectDefault = {time: { times: {}  } }

    const adminRender = props.adminRender === "admin"

    const buildObjectDefault = () => {
        
        Object.keys(cycle).forEach((key) => {
            timeObjectDefault.time.times[key] = {
                time:0
            }
            // { [key]: { time:0 }  }
        })
        
        return timeObjectDefault.time
    }

    const time = props.time ? props.time : buildObjectDefault();
    
    const navigate = useNavigate();
    const params = useParams()
    const {user, credential} = useAuth()
    
    const handleReview = async (e) => {

        const {workData, packs, deliverys} = await getWorkData({user, credential})
        navigate(`/${params.uid}/admin/tasks/review/${e.target.id}`, {
            state: {
                time:time,
                workData: workData,
                cycleKyes:prepareProductionStatusesForRender(workData),
                packs: packs,
            }
        })
    }
    
  return (
    <Paper elevation={4} sx={fixedHeightPaper}>
        <Typography variant="h6" color="secondary">Daily Tasks</Typography>
        <Typography variant="body2" color="secondary">
            <i>
                <b>Times are displayed in minutes</b>
            </i>
        </Typography>
        {
            Object.keys(cycle).map((status,index)=>{
                return(
                    <Paper key={index} display="flex" flexdirection="column" variant="outlined" sx={{padding:1,margin:1,}}>
                        <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
                            <Typography >
                                <b>Task: {capitalize(getKey(status))}</b>
                            </Typography>
                            <Typography >
                                <i>Expected Time:
                                    {
                                        transformTo("ms","minutes", time.times[status]?.time)
                                    }
                                </i>
                            </Typography>
                            {
                                adminRender && (
                                    <Button id={status} variant="contained" onClick={handleReview}> Review data </Button>
                                )
                            }
                        </Box>
                    </Paper>
                )
            })
        }
    </Paper>
  )
}
