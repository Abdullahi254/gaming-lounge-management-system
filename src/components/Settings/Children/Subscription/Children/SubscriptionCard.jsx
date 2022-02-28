import React from 'react'
import { Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../../../contexts/AuthContext';
export const DateContainer = styled(Box)(({ theme }) => ({
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    },
    margin: 'auto',
    marginTop: 1,
    justifyContent: 'space-around',

}))

export const DateItem = styled(Box)(({ theme }) => ({
    background: theme.palette.background.default,
    width: '44%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
}))

export const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    width: '600px',
    [theme.breakpoints.down('xl')]: {
        width: '500px'
    },
    [theme.breakpoints.down('lg')]: {
        width: '400px'
    },
    [theme.breakpoints.down('sm')]: {
        width: '300px'
    },
    alignItems: 'center',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    borderRadius: '20px',
    flexWrap: 'wrap',
    boxShadow: 'rgb(0, 0, 0) 0px 20px 30px -10px',
    minHeight: '220px'
}))

function SubscriptionCard() {
    const { currentUser } = useAuth()
    const [daysDue, setDaysDue] = React.useState(0)
    React.useEffect(()=>{
        currentUser.getIdTokenResult().then((idTokenResult)=>{
            const subEndClaim = idTokenResult.claims.subscriptionEnd
            console.log("subscription ends in: ", subEndClaim)
            console.log("is user premium: ", idTokenResult.claims.premium)
            const now = new Date()
            const endDate = new Date(subEndClaim)
            const diff = endDate.getTime() - now.getTime()
            if(diff>0){
                setDaysDue(Math.round(diff/86400000))
            }
        })
    },[currentUser])
    return (
        <StyledBox >
            <Typography
                variant='h5'
                m={2}
            >
                Subscription Due In
            </Typography>
            <DateContainer>
                <DateItem sx={{width:'70%'}}>
                    <Typography variant='h2'>
                        {daysDue}
                    </Typography>
                    <Typography variant='caption'>Days</Typography>
                </DateItem>
            </DateContainer>
        </StyledBox>
    )
}

export default SubscriptionCard