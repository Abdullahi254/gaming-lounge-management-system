import React from 'react'
import { styled } from '@mui/material/styles';
import { Alert, Box } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';

const StyledBox = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: 20,
    borderRadius: '20px',
}))
function VerificationCard() {
    const [clicked, setClicked] = React.useState(false)
    const { currentUser, sendUserVerification } = useAuth()
    const sendEmailHandler = () => {
        sendUserVerification().then(() => {
            setClicked(prev => !prev)
        })
    }
    return (
        <StyledBox sx={{display:currentUser.emailVerified && 'none'}}>
            {
                !currentUser.emailVerified && !clicked &&
                <Alert
                    sx={{ width: '100%', justifyContent: 'center' }}
                    severity="error"
                >
                    Please verify your email address --
                    <span
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={sendEmailHandler}
                    >
                        Verify email.
                    </span>
                </Alert>
            }

            {
                !currentUser.emailVerified && clicked &&
                <Alert sx={{ width: '100%', justifyContent: 'center' }} severity='success'>
                    Check your email inbox to verify.
                </Alert>
            }
        </StyledBox>
    )
}

export default VerificationCard