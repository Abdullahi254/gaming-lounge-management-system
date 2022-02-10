import React from 'react'
import { StyledBox } from '../../Account/children/Login'
import { Typography, TextField, Button, Alert, Box } from '@mui/material'
import { useAuth } from '../../../contexts/AuthContext'
import { styled } from '@mui/material/styles';
import logo from '../../../assets/imgs/logo.png'

const StyledImg = styled('img')(({ theme }) => ({
    height: 100,
    width: 150,
    borderRadius: '10px',
    filter: theme.palette.mode === 'light' ? 'invert(100%)' : 'invert(20%)',
    marginBottom:20
}))

function GetEmailCard() {
    const { passwordResetByMail } = useAuth()
    const emailRef = React.useRef()
    const [success, setSuccess] = React.useState()
    const [error, setError] = React.useState()
    const submitHandler = (e) => {
        e.preventDefault()
        setSuccess()
        setError()
        passwordResetByMail(emailRef.current.value).then(() => {
            setSuccess('A link has been sent to your email inbox')
        }).catch(er => {
            setError('Error sending link--check inserted email address')
        })
    }
    return (
        <Box
            component='div'
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                position: 'fixed',
            }}
        >
            <StyledImg src={logo} alt='A logo' />
            <StyledBox component='form' onSubmit={submitHandler}
                sx={{
                    minHeight: '250px',
                    position: 'relative',
                    top: 0,
                    left: 0,
                    transform: 'translateX(0%)',
                }}
            >
                {error && <Alert severity="error" sx={{ justifyContent: 'center', width: '100%', marginBottom: '10px' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ justifyContent: 'center', width: '100%', marginBottom: '10px' }}>{success}</Alert>}
                <Typography variant='h6' gutterBottom sx={{marginBottom:5, textDecoration:'underline'}}>Recover Password</Typography>
                <Typography>
                    Insert Email.
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
                <Button
                    size='small'
                    type='submit'
                    color='success'
                    variant='outlined'
                >
                    Email me a recovery password
                </Button>
            </StyledBox>
        </Box>
    )
}

export default GetEmailCard