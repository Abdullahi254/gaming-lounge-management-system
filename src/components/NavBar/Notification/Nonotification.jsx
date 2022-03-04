import React from 'react'
import {Typography} from '@mui/material'
function Nonotification() {
    return (
        <>
            <Typography
                sx={{
                    width: '200px',
                    height: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: '10px'
                }}
                component='div'
            >
                <Typography>No notification!</Typography>
            </Typography>
        </>
    )
}

export default Nonotification