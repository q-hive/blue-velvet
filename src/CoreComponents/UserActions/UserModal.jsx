import { Box, Button, Modal, Typography } from '@mui/material'
import React from 'react'

export const UserModal = ({modal, setModal, title, content, actions}) => {
    const handleCloseModal = () => {
        setModal({
            ...modal,
            open:false
        })
    }
    
    return (
        <Modal
        open={modal.open}
        onClose={handleCloseModal}
        >
            <Box sx={{width:"40%", height:"50%", background:"white"}}>
                <Typography>{title}</Typography>
                <Typography>{content}</Typography>

                {
                    actions.length > 0
                    ?
                    <>
                        {actions.map((action) => {
                            return <Button variant="contained" onClick={action.execute}>{action.label}</Button>
                        })}
                    </>
                    :
                    null
                }
                

            </Box>
        </Modal>
    )
}