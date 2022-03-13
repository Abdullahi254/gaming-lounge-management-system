import React from 'react'
import { StyledBox } from '../Subscription/Children/SubscriptionCard'
import { Alert, Typography } from '@mui/material'
import { useAuth } from '../../../../contexts/AuthContext'
import { projectFireStore as db } from '../../../../firebase/firebase'

function MpesaInfoCard() {
    const { currentUser } = useAuth()
    const [exists, setExists] = React.useState(false)
    React.useEffect(() => {
        // checking if dajara api keys exists in the db
        const docRef = db.collection("users").doc(currentUser.uid).collection("daraja").doc("darajaKeys")
        docRef.get().then(doc => {
            if (doc.exists) {
                setExists(true)
            } else {
                console.log("No such document!");
                setExists(false)
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            setExists(false)
        });

    }, [currentUser])
    return (
        <StyledBox sx={{ alignItems: 'start', }}>
            {
                exists ? <Alert severity="success" sx={{ justifyContent: 'center', width: '100%', marginBottom: 1, }}>
                    Your system is already integrated with Mpesa.
                </Alert> :
                    <Alert severity="error" sx={{ justifyContent: 'center', width: '100%', marginBottom: 1, }}>
                        Your system is not integrated with Mpesa.
                    </Alert>
            }

            <Typography variant='subtitle1' gutterBottom sx={{ fontWeight: 'bold' }}>
                You need the following:
            </Typography>
            <Typography gutterBottom>
                1. Copy of Business Certificate of Registration or Business Permit.
            </Typography>
            <Typography gutterBottom>
                2. Copy of identification documents i.e. Document ID (Passport/Alien ID/Military ID).
            </Typography>
            <Typography gutterBottom>
                3. copy of bank letter with your bank detail.
            </Typography>
            <Typography gutterBottom >
                4. Individual KRA PIN Certificate.
            </Typography>
            <Typography gutterBottom sx={{ marginBottom: 3 }}>
                5. Contact us once you have all your documents.
            </Typography>
            <Typography gutterBottom sx={{ fontStyle: 'italic' }} >
                NB: If you have a Till number linked with Bank, you do not need the documents above.
            </Typography>
        </StyledBox>
    )
}

export default MpesaInfoCard