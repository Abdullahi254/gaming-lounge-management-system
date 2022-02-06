import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BackDrop from '../../BackDrop/BackDrop'
import { useAuth } from '../../../contexts/AuthContext';

const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '20px',
    minHeight: '200px',
    width: '500px',
    [theme.breakpoints.down('sm')]: {
        width: '250px'
    },
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 10,

}))

function Login({ show, clicked, showPassword, handleClickShowPassword, handleMouseDownPassword }) {
    const emailRef = React.useRef()
    const passwordRef = React.useRef()
    const { reauthenticate, getCredentials } = useAuth()
    const reAuthHandler = (e) => {
        e.preventDefault()
        console.log(emailRef.current.value)
        console.log(passwordRef.current.value)
        const credential = getCredentials(emailRef.current.value, passwordRef.current.value)
        console.log(credential)
        reauthenticate(credential).then(() => {
            console.log('user re-authenticated')
            clicked()
        }).catch(er => {
            console.log('error occured re-authenticating user.')
            console.log(er)
        })
    }
    return (
        <>
            <BackDrop open={show} clicked={clicked} />
            <StyledBox sx={{ display: show ? 'flex' : 'none' }} component='form' onSubmit={reAuthHandler}>
                <Typography>
                    Login to continue...
                </Typography>
                <TextField
                    sx={{
                        margin: '10px',
                        width: '100%'
                    }}
                    required
                    id="outlined-email"
                    label="Email"
                    type='email'
                    inputRef={emailRef}
                />
                <TextField
                    sx={{
                        margin: '10px',
                        width: '100%'
                    }}
                    required
                    id="outlined-password"
                    label="Password"
                    type={showPassword ? 'string' : 'password'}
                    inputRef={passwordRef}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    size='small'
                    type='submit'
                    color='success'
                >
                    Continue
                </Button>

            </StyledBox>
        </>
    )
}

export default Login;
