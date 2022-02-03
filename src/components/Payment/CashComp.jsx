import { Button, Typography, Alert } from '@mui/material';
import React from 'react';
import { StyledBox } from './MpesaComp'

function CashComp(props) {
    return (
        <StyledBox sx={{ justifyContent: 'space-between', minHeight: '250px' }} component="form" onSubmit={props.cashSale}>
            {props.error && <Alert severity="error" sx={{ justifyContent: 'center', width: '100%' }} onClose={props.close}>{props.error}</Alert>}
            {props.success && <Alert severity="success" sx={{ justifyContent: 'center', width: '100%' }} onClose={props.close}>{props.success}</Alert>}
            <Typography gutterBottom variant='h5' align='center'>
                Receive.
            </Typography>
            <Typography gutterBottom variant='h3' align='center'>
                KSH.{props.amount}
            </Typography>
            <Button color='success' variant='outlined' sx={{ width: '70%' }} type='submit'>
                Create Sale
            </Button>
        </StyledBox>
    )
}

export default CashComp;
