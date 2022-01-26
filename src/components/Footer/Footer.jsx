import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles'

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link color="inherit" href="/">
                Aim Labs KE
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const StyledBox = styled(Box)(({ theme }) => ({
    padding: `${theme.spacing(2)} 0`,
    display: 'flex',
    [theme.breakpoints.down('md')]:{
        display:'none'
    },
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    background: theme.palette.background.paper
}))

export default function Footer() {
    return (

        <StyledBox component="footer">
            <Typography
                variant="body1"
            >
                AIM LABS KENYA
            </Typography>
            <Copyright />
        </StyledBox>

    );
}