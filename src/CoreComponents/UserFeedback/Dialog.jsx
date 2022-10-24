import React from "react"

import { 
    Dialog, DialogTitle, 
    DialogContent, DialogContentText,  
    DialogActions, Button
} from "@mui/material"

export const UserDialog = ({dialog,setDialog,open,title, content, actions, children}) => {
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
        maxWidth={"md"}
        PaperProps={{ sx: { padding: "3%" } }}
        sx={{
            backdropFilter: "blur(5px)",
            //other styles here
          }}
        >
            <DialogTitle textAlign="center">
                {title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
                {children}
            </DialogContent>

            <DialogActions>
                {actions.map((action, idx) => {
                    return (
                        <Button variant="contained" key={idx} onClick={action.execute} color={action.btn_color}>
                            {action.label}
                        </Button>
                        
                    )
                })}
            </DialogActions>
        </Dialog>
    )

}