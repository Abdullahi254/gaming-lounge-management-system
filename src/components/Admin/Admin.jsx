import React from 'react'
import CustomAdminForm from './Children/CustomAdminForm'
import { styled } from '@mui/material/styles';
import { Box, Alert, CircularProgress as Spinner } from '@mui/material'
import { getFunctions, httpsCallable } from "firebase/functions"
import { useAuth } from '../../contexts/AuthContext';
import NotFound from '../404/NotFound';

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
    const [admin, setAdmin] = React.useState(false)
    const functions = getFunctions()

    const { currentUser } = useAuth()

    React.useEffect(() => {
        currentUser.getIdTokenResult().then((idTokenResult) => {
            setAdmin(idTokenResult.claims.admin)
        })
        return () => setAdmin(false)
    }, [currentUser])


    const makeAdminHandler = (email) => {
        setLoading(true)
        const addAdminRole = httpsCallable(functions, "addAdminRole")
        addAdminRole({ email }).then(res => {
            setLoading(false)
            console.log(res)
            setSuccess(`${email} made admin successfully`)
        }).catch(er => {
            setLoading(false)
            console.log(er)
            setError("error")
        })
    }
    const subscriptionHandler = (email, days) => {
        setLoading(true)
        const updateSubscription = httpsCallable(functions, "updateSubscription")
        updateSubscription({ email, days }).then(res => {
            setLoading(false)
            console.log(res)
            setSuccess(`added ${days} days to ${email} subscription.`)
        }).catch(er => {
            setLoading(false)
            console.log(er)
            setError("error")
        })
    }
    const unSubhandler = (email) => {
        setLoading(true)
        const unsubScribeUser = httpsCallable(functions, "unsubScribeUser")
        unsubScribeUser({ email }).then(res => {
            setLoading(false)
            console.log(res)
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
        <>
            {
                admin ? <StyledContainer>
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

                </StyledContainer> :
                <NotFound/>
            }
        </>

    )
}

export default Admin