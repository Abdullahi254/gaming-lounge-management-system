import React from 'react'
import { Typography, Box, } from '@mui/material'
import { styled } from '@mui/material/styles';

const DateContainer = styled(Box)(({ theme }) => ({
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    [theme.breakpoints.down('sm')]:{
        width:'100%'
    },
    margin:'auto',
    marginTop:1,
    justifyContent:'space-around',

}))

const DateItem = styled(Box)(({ theme }) => ({
    background:theme.palette.background.default,
    width: '44%',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    padding:10,
    borderRadius:5,
}))

 const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    width:'600px',
    [theme.breakpoints.down('xl')]:{
        width:'500px'
    },
    [theme.breakpoints.down('lg')]:{
        width:'400px'
    },
    [theme.breakpoints.down('sm')]:{
        width:'300px'
    },
    alignItems:'center',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    borderRadius: '20px',
    flexWrap: 'wrap',
    boxShadow: 'rgb(0, 0, 0) 0px 20px 30px -10px',
    minHeight:'220px'
}))

function SubscriptionCard() {
    return (
        <StyledBox >
            <Typography
                variant='h5'
                sx={{ textDecoration: 'underline' }}
                m={2}
            >
                Subscription Due In.
            </Typography>
            <DateContainer>
                <DateItem>
                    <Typography variant='h4'>
                        14
                    </Typography>
                    <Typography variant='caption'>Months</Typography>
                </DateItem>
                <DateItem>
                    <Typography variant='h4'>
                        10
                    </Typography>
                    <Typography variant='caption'>Days</Typography>
                </DateItem>
            </DateContainer>
        </StyledBox>
    )
}

export default SubscriptionCard