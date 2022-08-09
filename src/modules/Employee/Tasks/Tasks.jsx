import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../../theme/BV-theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//Import individual tasks
import { HarvestingTask } from './StandaloneTasks/Harvesting';
import { PackingTask } from './StandaloneTasks/Packing';
import { DeliveryTask } from './StandaloneTasks/Delivery';
import { GrowingTask } from './StandaloneTasks/Growing';
import { MaintenanceTask } from './StandaloneTasks/Maintenance';


export const TasksCardsComponent = () => {
      
    const theme = useTheme(BV_THEME);
    
    return (
        <>
        
        <HarvestingTask />

        <PackingTask />

        <DeliveryTask />

        <GrowingTask />

        <MaintenanceTask />
        
        </>
    )
}
