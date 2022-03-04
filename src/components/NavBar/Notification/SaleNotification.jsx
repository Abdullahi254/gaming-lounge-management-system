import React from 'react'
import { Typography} from '@mui/material';

function SaleNotification({name,amount,date}) {
    return (
        <>
            Received&nbsp;<Typography sx={{ color: '#d32f2f' }}>KSH{amount.toFixed(2)}</Typography>
            &nbsp;From {name} On&nbsp;<Typography sx={{ color: '#d32f2f' }}>{date}.</Typography>
        </>
    )
}

export default SaleNotification