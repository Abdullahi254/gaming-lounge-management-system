import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button, CircularProgress as Spinner, Alert } from '@mui/material';
import BackDrop from '../../BackDrop/BackDrop'
import { getFunctions, httpsCallable } from "firebase/functions"

export const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '20px',
    minHeight: '200px',
    width: '500px',
    [theme.breakpoints.down('sm')]: {
        width: '90%'
    },
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 10,
    transition: 'ease-in-out'

}))



function DarajaKeysForm({ show, clicked }) {
    const emailRef = React.useRef()
    const consumerKeyRef = React.useRef()
    const consumerSecretRef = React.useRef()
    const shortCodeRef = React.useRef()
    const passkeyRef = React.useRef()

    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState()
    const [error, setError] = React.useState()

    const functions = getFunctions()

    const submitKeysHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        setError()
        setSuccess()
        const addDarajaDetails = httpsCallable(functions, "addDarajaDetails")
        addDarajaDetails({
            email:emailRef.current.value.trim(),
            consumerKey: consumerKeyRef.current.value.trim(),
            consumerSecret: consumerSecretRef.current.value.trim(),
            passkey: passkeyRef.current.value.trim(),
            shortCode: shortCodeRef.current.value.trim()
        }).then(res => {
            setLoading(false)
            console.log(res)
            setSuccess("added daraja API keys successfully")
        }).catch(er => {
            setLoading(false)
            console.log(er)
            setError(`${er.code}-${er.message}`)
        })
    }
    const closeAlertHandler = () => {
        setError()
        setSuccess()
    }
    return (
        <>
            <BackDrop open={(show)} clicked={clicked} />
            <StyledBox sx={{ display: show ? 'flex' : 'none' }} component='form' onSubmit={submitKeysHandler}>
                <Typography sx={{ marginBottom: 1 }}>
                    Add daraja key for user.
                </Typography>
                {loading && <Spinner />}
                {success && <Alert severity="success" sx={{ justifyContent: 'center', width: '100%', marginBottom: 2 }} onClose={closeAlertHandler}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ justifyContent: 'center', width: '100%', marginBottom: 2 }} onClose={closeAlertHandler}>{error}</Alert>}
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
                    id="outlined-consumerKey"
                    label="Consumer Key"
                    inputRef={consumerKeyRef}
                />
                <TextField
                    sx={{
                        margin: '10px',
                        width: '100%'
                    }}
                    required
                    id="outlined-consumerSecret"
                    label="Consumer Secret"
                    inputRef={consumerSecretRef}
                />
                <TextField
                    sx={{
                        margin: '10px',
                        width: '100%'
                    }}
                    required
                    id="outlined-shortCode"
                    label="Short Code"
                    inputRef={shortCodeRef}
                />
                <TextField
                    sx={{
                        margin: '10px',
                        width: '100%'
                    }}
                    required
                    id="outlined-passkey"
                    label="Passkey"
                    inputRef={passkeyRef}
                />
                <Button
                    size='small'
                    type='submit'
                    color='success'
                >
                    Submit
                </Button>

            </StyledBox>
        </>
    )
}

export default DarajaKeysForm;
