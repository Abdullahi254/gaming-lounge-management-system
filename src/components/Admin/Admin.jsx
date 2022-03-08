import React from 'react'
import CustomAdminForm from './Children/CustomAdminForm'
import { styled } from '@mui/material/styles';
import { Box, Alert, CircularProgress as Spinner } from '@mui/material'
import axios from 'axios';

const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: '1000px',
    margin: 'auto'
}))

function Admin() {
    const [success, setSuccess] = React.useState();
    const [error, setError] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const makeAdminHandler = (email) => {
        setLoading(true)
        axios({
            method: 'post',
            url: "https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/api/admin/make-admin",
            data: {
                email: email,
            }
        }).then(res => {
            setLoading(false)
            setSuccess(`${email} made admin successfully`)
        }).catch(er => {
            setLoading(false)
            console.log(er)
            setError("error")
        })
    }
    const subscriptionHandler = (email, days) => {
        setLoading(true)
        axios({
            method: 'post',
            url: "https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/api/admin/subscribe-specify-days",
            data: {
                email: email,
                days:days
            }
        }).then(res => {
            setLoading(false)
            setSuccess(`${email} subscription increased by ${days} days.`)
        }).catch(er => {
            setLoading(false)
            console.log(er)
            setError("error")
        })
    }
    const unSubhandler = (email) => {
        setLoading(true)
        axios({
            method: 'post',
            url: "https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/api/admin/unsubscribe",
            data: {
                email: email,
            }
        }).then(res => {
            setLoading(false)
            setSuccess(`${email} unsubscribed successfully`)
        }).catch(er => {
            setLoading(false)
            console.log(er)
            setError("error")
        })
    }
    const closeAlertHandler = () => {
        setSuccess()
        setError()
    }
    return (
        <StyledContainer>
            {
                loading && <Spinner />
            }
            {success && <Alert severity="success" sx={{ justifyContent: 'center', width: '100%', marginBottom: 2 }} onClose={closeAlertHandler}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ justifyContent: 'center', width: '100%', marginBottom: 2 }} onClose={closeAlertHandler}>{error}</Alert>}
            <CustomAdminForm
                label="Make Admin"
                submit={(email) => makeAdminHandler(email)}
            />
            <CustomAdminForm
                label="Increase Subscription"
                days
                submit={(email, days) => subscriptionHandler(email, days)}
            />
            <CustomAdminForm
                label="Unsubscribe User"
                submit={(email) => unSubhandler(email)}
            />

        </StyledContainer>
    )
}

export default Admin