import React, { useState } from 'react'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import Modal from 'react-modal'
import { Button } from '@mui/material'

import LoginIcon from '@mui/icons-material/Login';

export const LoginInputs = ({
    handleSignIn,
    handleAdminSignIn,
    handleLoginData,
    loginData, 
    loading,
    openPassphrase,
}) => {

    const [adminLogin, setAdminLogin] = useState(false)

    let { email, password, passphrase} = loginData

    return (
        <ValidatorForm
            onSubmit={adminLogin ? handleAdminSignIn : handleSignIn}
            onError={errors => console.log(errors)}
            sx={{
                display:"flex",
                flexDirection:"column"
            }}
        >
            <TextValidator 
                label="Email"
                variant="outlined" 
                name="email"
                id="email" 
                value={email}
                validators={['required']}
                errorMessages={['Passphrase is required']}
                onChange={handleLoginData}
            />
            <TextValidator 
                label="Password"
                variant="outlined" 
                name="pass"
                id="password" 
                value={password}
                validators={['required']}
                errorMessages={['Passphrase is required']}
                disabled={loading}
                onChange={handleLoginData}
            />
            
            <Button 
                sx={{background:"#0E0C8F", color:"white"}} 
                endIcon={<LoginIcon/>} 
                type="submit"
            >
                {loading ? "Loading..." : "Login"}
            </Button>
            <Modal
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
            </Modal>
            
        </ValidatorForm>
    );
}