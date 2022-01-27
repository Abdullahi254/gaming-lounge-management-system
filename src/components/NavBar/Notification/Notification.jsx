import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 2
}))

function Notification({ amount, name, date }) {
    return (
        <StyledPaper  variant="outlined">
            Received&nbsp;<Typography sx={{color:'#d32f2f'}}>KSH{amount.toFixed(2)}</Typography>
            &nbsp;From {name} On&nbsp;<Typography sx={{color:'#d32f2f'}}>{date}.</Typography>
        </StyledPaper>
    )
}

export default Notification;
