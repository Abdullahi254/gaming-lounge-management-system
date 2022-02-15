import React from 'react';
import { Box, Typography, FormControl, OutlinedInput, FormHelperText, InputAdornment, Button } from '@mui/material'
import { styled } from '@mui/material/styles';

export const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    margin: 'auto',
    marginTop: 30,
    background: theme.palette.background.paper,
    borderRadius: '20px',
    width: '80%',
    minHeight:'300px',
    boxShadow:'rgb(0, 0, 0) 0px 20px 30px -10px'
}))


function MpesaComp({mpesaPrompt,mpesaRef,handleChange,error}) {
    return (
        <StyledBox component="form" onSubmit={mpesaPrompt}>
            <Typography variant="subtitle1" align='center' sx={{marginBottom:4}}>
                Insert Mpesa Phone Number.
            </Typography>
            <FormControl sx={{ m: 1, marginBottom:4}} variant="outlined" fullWidth>
                <OutlinedInput
                    error={error}
                    onChange={handleChange}
                    inputRef={mpesaRef}
                    required
                    type="number"
                    id="outlined-adornment-mpesa"
                    startAdornment={<InputAdornment position="start">+254</InputAdornment>}
                    aria-describedby="outlined-mpesa-helper-text"
                    inputProps={{
                        'aria-label': 'mpesa',
                    }}
                />
                <FormHelperText id="outlined-mpesa-helper-text">We'll never share your number.</FormHelperText>
            </FormControl>
            <Button color='success' variant='outlined' sx={{width:'70%'}} type='submit'>PAY</Button>
        </StyledBox>
    )
}

export default MpesaComp;
