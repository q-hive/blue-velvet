import React, { useState } from 'react'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import { Box, Button, Modal, TextField, useTheme } from '@mui/material'

import LoginIcon from '@mui/icons-material/Login';
import { BV_THEME } from '../../theme/BV-theme';


export const LoginInputs = ({
    handleSignIn,
    handleAdminSignIn,
    handleLoginData,
    loginData, 
    loading,
    openPassphrase,
    closePassModal
}) => {
    const theme = useTheme(BV_THEME)

    const [adminLogin, setAdminLogin] = useState(false)

    let { email, password, passphrase } = loginData

    return (
        <div sx={{alignItems:"center"}}>
            
            <ValidatorForm
            onSubmit={handleSignIn}
            onError={errors => console.log(errors)}
            sx={{
                display:"flex",
                flexDirection:"column",
                alignItems:"center"
            }}
            
        >
            <Box display="flex" flexDirection="column" alignItems="center" width="100%">
            <TextValidator 
                label="Email"
                variant="outlined" 
                name="email"
                id="email" 
                value={email}
                validators={['required']}
                errorMessages={['Email is required']}
                onChange={handleLoginData}
                sx={theme.input.mobile.fullSize.desktop.fullSize}
            />
            <TextValidator
                label="Password"
                variant="outlined"
                type="password"
                name="pass"
                id="password" 
                value={password}
                validators={['required']}
                errorMessages={['Password is required']}
                disabled={loading}
                onChange={handleLoginData}
                sx={theme.input.mobile.fullSize.desktop.fullSize}
            />
            
            <Button 
                variant="contained"
                size="large"
                endIcon={<LoginIcon/>} 
                type="submit"
            >
                {loading ? "Loading..." : "Login"}
            </Button>
            </Box>
        </ValidatorForm>
        
        {
            <>
            
            <Modal
            open={openPassphrase}
            onClose={closePassModal}
            
            >   
                <Box component="form" onSubmit={handleAdminSignIn} sx={theme.loginModal.sx} display="flex" flexDirection="column">
                    <TextField
                    label="Passphrase"
                    variant="outlined" 
                    name="passphrase"
                    id="passphrase" 
                    disabled={loading}
                    onChange={handleLoginData}
                    required
                    
                    />
                    <Button 
                        sx={()=>({...BV_THEME.button.standard, })} 
                        color="primary"
                        variant="contained"
                        endIcon={<LoginIcon/>} 
                        type="submit"
                    >
                        {loading ? "Loading..." : "Send Passphrase"}
                    </Button>   
                </Box>
            </Modal>
            </>
            
        }
            
            {/* <Modal
                isOpen={openPassphrase}
                onAfterOpen={() => setAdminLogin(true)}
                contentLabel="Please enter your secret passphrase"
            >
                { openPassphrase && 
                <TextValidator
                    label="Passphrase"
                    variant="outlined" 
                    name="passphrase"
                    id="passphrase" 
                    disabled={loading}
                    onChange={handleLoginData}
                    value={passphrase}
                    validators={['required']}
                    errorMessages={['Passphrase is required']}
                />}
                <Button 
                    sx={{background:"#0E0C8F", color:"white"}} 
                    endIcon={<LoginIcon/>} 
                    type="submit"
                >
                    {loading ? "Loading..." : "Send passphrase"}
                </Button>
            </Modal>  */}
       </div>
    );
}