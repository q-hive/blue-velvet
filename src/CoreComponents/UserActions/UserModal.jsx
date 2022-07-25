import { Box, Button, Modal, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BV_THEME } from '../../theme/BV-theme'

export const UserModal = ({modal, setModal, title, content, actions}) => {
    const handleCloseModal = () => {
        setModal({
            ...modal,
            open:false
        })
    }

    const theme = useTheme(BV_THEME)
    
    return (
        <Modal
        style={{display:'flex',alignItems:'center',justifyContent:'center'}}
        open={modal.open}
        onClose={handleCloseModal}
        >
            <Box sx={{width:{xs:"80%",sm:"60%",md:"50%",lg:"40%"}, height:"50%", background:"white", flexDirection:"column", display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Typography variant="h4">{title}</Typography>
                <Typography>{content}</Typography>

                {
                    actions.length > 0
                    ?
                    <>
                        {actions.map((action, idx) => {
                            return <Button variant="contained" sx={()=>({...theme.button.dialog, borderRadius:"20px"})} key={idx} color={action.btn_color} onClick={action.execute}>{action.label}</Button>
                            
                        })}
                    </>
                    :
                    null
                }
                

            </Box>
        </Modal>
    )
}