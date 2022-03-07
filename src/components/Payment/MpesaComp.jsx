import React from 'react';
import { Box, Typography, TextField, FormHelperText, InputAdornment, Button, Alert } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext'
import { projectFireStore as db } from '../../firebase/firebase';

export const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    margin: 'auto',
    marginTop: 10,
    background: theme.palette.background.paper,
    borderRadius: '20px',
    width: '80%',
    minHeight: '300px',
    boxShadow: 'rgb(0, 0, 0) 0px 20px 30px -10px'
}))


function MpesaComp({ mpesaPrompt, mpesaRef, handleChange, error, checkoutId, loading, stopLoading, resetCheckoutId, transactionError, close, info, collection, ...props }) {
    const { currentUser } = useAuth()
    const [success, setSuccess] = React.useState();
    React.useEffect(() => {
        function fetchDoc() {
            //fetching newdata from the database using authenticated user's credentials
            const query = db.collection(`users/${currentUser.uid}/${collection}`).where('checkoutId', '==', checkoutId)
            query.onSnapshot(querySnapshot => {
                if (!querySnapshot.empty) {
                    setSuccess("Payment was successfull")
                    stopLoading()
                    resetCheckoutId()
                    currentUser.getIdToken(true)
                }
            })
        }
        fetchDoc()
        return () => setSuccess()

    }, [currentUser, checkoutId, stopLoading, resetCheckoutId, collection])
    const closeAlertHandler = () => {
        setSuccess()
    }
    return (
        <StyledBox component="form" onSubmit={mpesaPrompt} {...props}>
            <Typography variant="subtitle1" align='center' sx={{ marginBottom: 4 }}>
                {info}
            </Typography>
            {success && <Alert severity="success" sx={{ justifyContent: 'center', width: '100%', marginBottom: 3 }} onClose={closeAlertHandler}>{success}</Alert>}
            {transactionError && <Alert severity="error" sx={{ justifyContent: 'center', width: '100%', marginBottom: 3 }} onClose={close}>{transactionError}</Alert>}
            <TextField
                sx={{ m: 1, marginBottom: 4 }}
                fullWidth
                error={error}
                onChange={handleChange}
                inputRef={mpesaRef}
                required
                type="number"
                id="outlined-adornment-mpesa"
                InputProps={{
                    startAdornment: <InputAdornment position="start">+254</InputAdornment>
                }}
                label="Mpesa Number."
                helperText={error && 'incorrect phone number'}
                variant="outlined"
            />
            <FormHelperText id="outlined-mpesa-helper-text">We'll never share your number.</FormHelperText>
            <Button color='success' variant='outlined' sx={{ width: '70%' }} type='submit' disabled={loading}>PAY</Button>
        </StyledBox>
    )
}

export default MpesaComp;
