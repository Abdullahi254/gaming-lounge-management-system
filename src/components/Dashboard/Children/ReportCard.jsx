import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import analytImg from '../../../assets/imgs/Analytic.png'
import { useAuth } from '../../../contexts/AuthContext'
import ReportForm from './ReportForm';
import ReportPdf from './ReportPdf';
import { projectFireStore as db } from '../../../firebase/firebase'
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
    const [showForm, setShowForm] = React.useState(false)
    const [showReportCard, setShowReportCard] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [electBill, setElectBill] = React.useState()
    const [error, setError] = React.useState()
    const [sales, setSales] = React.useState()
    const [sub, setSub] = React.useState()
    const [monthYear, setMonthYear] = React.useState()
    const handlePopup = () => {
        setShowForm(true)
    }
    const handleReportForm = async (month, year, bill) => {
        setSales()
        setSub()
        setLoading(true)
        setElectBill(bill)
        await fetchSubscription(month, year)
        fetchMonthSales(month, year)
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = months[month];
        setMonthYear({
            month:monthName,
            year:year
        })
    }
    const fetchMonthSales = (month, year) => {
        db.collection(`users/${currentUser.uid}/statements`).where("month", "==", month)
            .where("year", "==", year).get()
            .then((querySnapShot) => {
                if (querySnapShot.empty) {
                    console.log('No matching documents')
                    setError('No matching documents!')
                    setLoading(false)
                    return
                }
                setSales(querySnapShot.docs.map(doc => doc.data()))
                setLoading(false)
                setShowForm(false)
                setShowReportCard(true)
            }).catch((er => {
                setError("Error fetching doc!")
                setLoading(false)
            }))
    }
    const fetchSubscription = (month, year) => {
        db.collection(`users/${currentUser.uid}/subscriptions`).where("month", "==", month)
            .where("year", "==", year).get()
            .then((querySnapShot) => {
                if (querySnapShot.empty) {
                    console.log('No matching documents')
                    return
                }
                let amount = 0
                querySnapShot.docs.forEach((doc => {
                    amount += doc.data().amount
                }))
                setSub(amount)
            }).catch((er => {
                console.log("error fetching sub fees")
            }))
    }
    return (
        <>
            {
                (showReportCard && !loading) && <ReportPdf
                    date={monthYear}
                    subFee={sub}
                    sales={sales}
                    electBill={electBill}
                    open={showReportCard}
                    handleClick={() => setShowReportCard(false)}
                />
            }

            <ReportForm
                closeAlert={() => setError()}
                error={error}
                loading={loading}
                open={showForm}
                handleClick={() => setShowForm(false)}
                handleForm={(month, year, bill) => handleReportForm(month, year, bill)}
            />
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
