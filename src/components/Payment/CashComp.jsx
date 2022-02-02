import { Button, Typography } from '@mui/material';
import React from 'react';
import { StyledBox } from './MpesaComp'

function CashComp(props) {
    return (
        <StyledBox sx={{justifyContent:'space-between', minHeight:'250px'}}>
            <Typography gutterBottom variant='h5' align='center'>
                Receive.
            </Typography>
            <Typography gutterBottom variant='h3' align='center'>
                KSH.{props.amount}
            </Typography>
            <Button color='success' variant='outlined' sx={{ width: '70%' }} type='submit' onClick={props.cashSale}>
                Create Sale
            </Button>
        </StyledBox>
    )
}

export default CashComp;
