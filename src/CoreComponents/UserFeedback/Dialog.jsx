import React from "react"

import { 
    Dialog, DialogTitle, 
    DialogContent, DialogContentText,  
    DialogActions, Button
} from "@mui/material"

export const UserDialog = ({dialog,setDialog,open,title, content, actions}) => {
    const handleClose = () => {
        setDialog({
            ...dialog,
            open:false
        })
    }
    
    return (
        <Dialog
        open={open}
        onClose={handleClose}
        >
            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                {actions.map((action, idx) => {
                    return (
                        <Button key={idx} onClick={action.execute}>
                            {action.label}
                        </Button>
                        
                    )
                })}
            </DialogActions>
        </Dialog>
    )

}