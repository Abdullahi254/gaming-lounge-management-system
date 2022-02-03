import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

export const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    msTransform: 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
    background: theme.palette.background.paper,
    borderRadius: '20px',
    minWidth: '65%',
    minHeight: '350px',
    boxShadow: 'rgb(0, 0, 0) 0px 20px 30px -10px'
}))
function AmountStatus() {
    const { time, price } = useParams()
    // this code runs just before component is mounted or updated. It calculates amount of time played in minutes
    const [sHours, sMinutes, sSeconds] = time.split(':')
    const day = new Date()
    const hoursPlayed = day.getHours() - parseInt(sHours)
    const minutesPlayed = day.getMinutes() - parseInt(sMinutes)
    const secondsPlayed = day.getSeconds() - parseInt(sSeconds)
    const totalSecondsPlayed = (hoursPlayed * 3600) + (minutesPlayed * 60) + secondsPlayed 
    const totalMilliseconds = (totalSecondsPlayed * 1000)
    return (
        <div style={{ height: '100%' }}>
            <StyledBox>
                <Typography variant='h5' align='center' gutterBottom>
                    You have played for:
                </Typography>
                <Typography variant='h4' align='center' gutterBottom sx={{ marginBottom: 3 }}>
                    <span>{("0" + Math.floor((totalMilliseconds / 3600000) % 60)).slice(-2)}:</span>
                    <span>{("0" + Math.floor((totalMilliseconds / 60000) % 60)).slice(-2)}:</span>
                    <span>{("0" + Math.floor((totalMilliseconds / 1000) % 60)).slice(-2)}</span>
                </Typography>
                <Typography variant='h5' align='center' gutterBottom>
                    You owe:
                </Typography>
                <Typography variant='h4' align='center' sx={{ marginBottom: 3 }}>
                    KSH.{Math.round((totalMilliseconds / 60000) * price)}
                </Typography>
                <Typography variant='subtitle1' align='center' gutterBottom>
                    System Developer:
                </Typography>
                <Typography component="div" >
                    <span> <a href="https://linkedin.com/in/abdullahi-mohamud-aa04291b6" style={{ textDecoration: 'none', color: 'inherit' }}><LinkedInIcon color='info'/></a></span>
                    <span> <a href="https://github.com/Abdullahi254" style={{ textDecoration: 'none', color: 'inherit' }}><GitHubIcon /></a></span>
                </Typography>
            </StyledBox>
        </div>

    )
}

export default AmountStatus;
