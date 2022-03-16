import React from 'react'
import { Typography, Box } from "@mui/material"
function Paybill(props) {
    return (
        <Box sx=
            {{
                width: '100%',
                padding: 0,
                boxShadow: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
            }}>

            <Typography variant='subtitle1' gutterBottom sx={{ fontWeight: 'bold' }}>
                How to pay:
            </Typography>
            <Typography gutterBottom>
                1. Go to Mpesa App or Toolkit
            </Typography>
            <Typography gutterBottom>
                2. Paybill: 000000
            </Typography>
            <Typography gutterBottom>
                3. Account: {props.email}
            </Typography>
            <Typography gutterBottom >
                4. Amount: <b>KSH{props.amount.toFixed(2)}</b>
            </Typography>
            <Typography gutterBottom sx={{ fontStyle: 'italic' }} >
                NB: Contact us if you have any payment issues.
            </Typography>
        </Box>
    )
}

export default Paybill