import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import DollarIcon from '@mui/icons-material/MonetizationOn';
import { useAuth } from '../../../contexts/AuthContext';
import { projectFireStore as db } from '../../../firebase/firebase';

const StyledBox = styled(Box)(({ theme }) => ({
    padding: 20,
    display: 'flex',
    margin: 10,
    flexWrap: 'wrap'
}))

const StyledCard = styled(Box)(({ theme }) => ({
    minWidth: '220px',
    [theme.breakpoints.down('sm')]: {
        minWidth: '250px'
    },
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    margin: 10,
    borderRadius: '30px',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
}))

const StyledDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'nowrap'
}))

function SalesCard() {
    const { currentUser } = useAuth()
    const [weekEarning, setWeekEarning] = useState(0)
    const [monthEarning, setMonthEarning] = useState(0)

    useEffect(() => {
        // get months earnings from db
        const event = new Date()
        const currentMonth = event.getMonth()
        const currentYear = event.getFullYear()

        const query = db.collection(`users/${currentUser.uid}/statements`).where('month', '==', currentMonth)
            .where('year', '==', currentYear)
        query.onSnapshot(querySnapshot => {
            if (!querySnapshot.empty) {
                let totalSum = querySnapshot.docs.map(doc => doc.data().amount).reduce((prev, curr) => prev + curr, 0)
                setMonthEarning(totalSum)
            }
        }, err => {
            console.log(err)
        })
        return () => setMonthEarning(0)

    }, [currentUser])

    useEffect(() => {
        // get weeks earnings from db
        const event = new Date()
        let currentDate = event.getDate()
        event.setDate(currentDate - 6)
        const now = new Date()

        const query = db.collection(`users/${currentUser.uid}/statements`).where('date', '>=', event)
            .where('date', '<=', now)
        query.onSnapshot(querySnapshot => {
            if (!querySnapshot.empty) {
                let totalSum = querySnapshot.docs.map(doc => doc.data().amount).reduce((prev, curr) => prev + curr, 0)
                setWeekEarning(totalSum)
            }
        }, err => {
            console.log(err)
        })


        return () => setWeekEarning(0)


    }, [currentUser])

    return (
        <StyledBox>
            <StyledCard
                sx={{
                    background:
                        (theme) => `linear-gradient(45deg, ${theme.palette.background.paper} 30%, #ADD8E6 90%)`
                }}
            >
                <StyledDiv>
                    <Typography component="div" sx={{ my: 2 }}>
                        <Typography variant='h5'>Week Earnings</Typography>
                    </Typography>
                    <Typography variant='h6'>KSH {weekEarning.toFixed(2)}</Typography>
                    <Typography variant='caption'>This Weeks Revenue.</Typography>
                </StyledDiv>
                <DollarIcon />
            </StyledCard>

            <StyledCard
                sx={{
                    background:
                        (theme) => `linear-gradient(45deg, ${theme.palette.background.paper} 30%, #FE6B8B  90%)`
                }}
            >
                <StyledDiv>
                    <Typography component="div" sx={{ my: 2 }}>
                        <Typography variant='h5'>Month Earnings</Typography>
                    </Typography>
                    <Typography variant='h5'>KSH {monthEarning.toFixed(2)}</Typography>
                    <Typography variant='caption'>This Months Revenue.</Typography>
                </StyledDiv>
                <DollarIcon />
            </StyledCard>
        </StyledBox>
    )
}

export default SalesCard
