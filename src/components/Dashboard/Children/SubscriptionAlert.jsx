import React from 'react'
import { styled } from '@mui/material/styles';
import { Alert, Box } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom'
const StyledBox = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: 20,
    borderRadius: '20px',
}))
function SubscriptionCard() {
    const [premium, setPremeium] = React.useState(true)
    const { currentUser } = useAuth()

    currentUser.getIdTokenResult().then((idTokenResult) => {
        const premiumClaim = idTokenResult.claims.premium
        setPremeium(premiumClaim)
    })
    return (
        <StyledBox sx={{display:premium && 'none'}}>
            {
                !premium &&
                <Alert
                    sx={{ width: '100%', justifyContent: 'center' }}
                    severity="error"
                >
                    You are currently not subscribed--
                    <Link
                        style={{ cursor: 'pointer', color: 'inherit' }}
                        to="/settings/my-subscription"
                    >
                        subscribe.
                    </Link>
                </Alert>
            }

        </StyledBox>
    )
}

export default SubscriptionCard