import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../contextHooks/useAuthContext';
import { BV_THEME } from '../../theme/BV-theme';
import { capitalize } from '../../utils/capitalize';
import { getKey, translationKeysByStatusLabel } from '../../utils/getDisplayKeyByStatus';
import { transformTo } from '../../utils/times';
import { getWorkData } from '../requests';
import { prepareProductionStatusesForRender } from './methods/CycleKeysManagement';

const fixedHeightPaper = {
    padding: BV_THEME.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 800
}

export const DailyTasksCard = (props) => {
    const {t} = useTranslation(['daily_tasks_cards','tasks', 'buttons'])
    
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
        <Typography variant="h6" color="secondary">{t('daily_tasks_card_title',{ns:'daily_tasks_cards'})}</Typography>
        <Typography variant="body2" color="secondary">
            <i>
                <b>{t('times_display_specification',{ns:'daily_tasks_cards'})}</b>
            </i>
        </Typography>
        {
            Object.keys(cycle).map((status,index)=>{
                let task = capitalize(t(translationKeysByStatusLabel[getKey(status)],{ns:'tasks'}))
                let times = transformTo("ms","minutes", time.times[status]?.time)
                return(
                    <Paper key={index} display={status == 'growing'? 'none' : 'flex'} flexdirection="column" variant="outlined" sx={{padding:1,margin:1,}}>
                        <Box sx={{display:status == 'growing'? 'none' : 'flex',flexDirection:"column",justifyContent:"space-evenly",alignContent:"space-evenly"}}>
                            <Typography >
                                <b>{t('task_word',{ns:'tasks',task})}</b>
                            </Typography>
                            <Typography >
                                <i>
                                    {t('expected_time_admn_dashboard',{ns:'tasks', times})}
                                </i>
                            </Typography>
                            {
                                adminRender && (
                                    <Button id={status} variant="contained" onClick={handleReview}>
                                        {t('admin_dashboard_tasks_review',{ns:'buttons'})}
                                    </Button>
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
