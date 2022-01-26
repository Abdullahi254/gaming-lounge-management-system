import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import analytImg from '../../../assets/imgs/Analytic.png'

const StyledBox = styled(Box)(({ theme }) => ({
    maxWidth: '500px',
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    margin:10,
    borderRadius:'30px',
    flexWrap:'nowrap'
}))

const StyledDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'flex-start',
    flexWrap:'nowrap'
}))

const StyledImg = styled('img')(({ theme }) => ({
    height:'200px',
    width:'200px'
}))

const StyledText = styled(Typography)(({ theme }) => ({
    fontSize:'16px',
    fontWeight:'bold',
    margin:'5px 0 ',
    [theme.breakpoints.down('sm')]:{
        fontSize:'14px'
    }
}))

function ReportCard() {
    return (
        <StyledBox>
            <StyledDiv>
                <StyledText>Hey There,</StyledText>
                <StyledText>Download Latest Report</StyledText>
                <Button color='secondary'  size="small" sx={{my:2}} variant='outlined'>Download</Button>
            </StyledDiv>
            <StyledImg src={analytImg} alt="analytics img"/>
        </StyledBox>
    )
}

export default ReportCard
