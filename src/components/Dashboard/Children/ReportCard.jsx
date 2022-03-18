import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import analytImg from '../../../assets/imgs/Analytic.png'
import { useAuth } from '../../../contexts/AuthContext'
import ReportForm from './ReportForm';

const StyledBox = styled(Box)(({ theme }) => ({
    maxWidth: '500px',
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    margin: 10,
    marginBottom: 10,
    borderRadius: '30px',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('xl')]: {
        width: '350px'
    },
}))

const StyledDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'nowrap'
}))

const StyledImg = styled('img')(({ theme }) => ({
    height: '200px',
    width: '200px',
    [theme.breakpoints.down('xl')]: {
        width: '150px',
        height: '150px'
    },
}))

const StyledText = styled(Typography)(({ theme }) => ({
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '5px 0 ',
    [theme.breakpoints.down('xl')]: {
        fontSize: '15px'
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '14px'
    }
}))

function ReportCard() {
    const { currentUser } = useAuth()
    const [show, setShow] = React.useState(false)
    const handlePopup = () => {
        setShow(true)
    }
    return (
        <>
            <ReportForm open={show} handleClick={() => setShow(false)} />
            <StyledBox>
                <StyledDiv>
                    <StyledText>Hey there {currentUser.displayName},</StyledText>
                    <StyledText>Download Latest Report</StyledText>
                    <Button color='secondary' size="small" sx={{ my: 2 }} variant='outlined' onClick={handlePopup}>Download</Button>
                </StyledDiv>
                <StyledImg src={analytImg} alt="analytics img" />
            </StyledBox>
        </>
    )
}

export default ReportCard
