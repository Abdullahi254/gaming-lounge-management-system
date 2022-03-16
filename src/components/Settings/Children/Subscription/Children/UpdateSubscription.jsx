import React from 'react';
import { StyledBox, DateContainer as MiniContainer, DateItem as Item } from './SubscriptionCard';
import { Box, Slider, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../../../../contexts/AuthContext';
import MpesaComp from '../../../../Payment/MpesaComp';

function UpdateSubscription() {
    const [month, setMonth] = React.useState(1)
    const [price, setPrice] = React.useState(1)
    const [isInvalid, setIsInvalid] = React.useState(true)
    const [loading, setLoading] = React.useState(false)
    const [mpesaError, setMpesaError] = React.useState()
    const [checkoutId, setCheckoutId] = React.useState(' ')

    const { currentUser } = useAuth()
    const mpesaRef = React.useRef()


    const handleMpesaPrompt = (e) => {
        e.preventDefault()
        setMpesaError()
        setCheckoutId(' ')
        if (!isInvalid) {
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 60000)
            axios({
                method: 'post',
                url: "https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/api/stp-subscribe",
                data: {
                    email: currentUser.email,
                    month: month,
                    phone: mpesaRef.current.value
                }
            }).then(res => {
                console.log(res)
                setCheckoutId(res.data.CheckoutRequestID);

            }).catch(er => {
                setMpesaError("Error sending request-Try again")
                setLoading(false)
                console.log(er)
            })
        }

    }
    function checkValidity(e) {
        let num = e.target.value
        const regx = /^\d{9}$/
        if (regx.test(num)) {
            setIsInvalid(false)
        }
        else setIsInvalid(true)
    }

    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            setMonth(newValue);
            let price = (newValue * 1)
            if (newValue !== 1) {
                price = (90 / 100 * price)
                setPrice(price)
            } else setPrice(price)

        }
    };

    return (
        <StyledBox>
            <Typography
                variant='h5'
                m={2}
            >
                Update Subscription
            </Typography>
            <Box sx={{ width: '100%' }}>
                <Slider
                    aria-label="Months"
                    defaultValue={1}
                    valueLabelDisplay="auto"
                    step={1}
                    min={1}
                    max={12}
                    marks
                    onChange={handleChange}
                />
            </Box>
            <Typography variant='caption'>(Interact with slider)</Typography>
            <MiniContainer>
                <Item sx={{ background: (theme) => theme.palette.background.paper }}>
                    <Typography variant='h4'>
                        {month}
                    </Typography>
                    <Typography variant='caption'>MONTH</Typography>
                </Item>
                <Item sx={{ background: (theme) => theme.palette.background.paper }}>
                    <Typography variant='h4'>
                        {price}
                    </Typography>
                    <Typography variant='caption'>PRICE(KSH)</Typography>
                </Item>
            </MiniContainer>
            <MpesaComp
                sx={{ width: '100%', padding: 0, boxShadow: 0 }}
                mpesaRef={mpesaRef}
                mpesaPrompt={handleMpesaPrompt}
                handleChange={checkValidity}
                error={isInvalid}
                checkoutId={checkoutId}
                loading={loading}
                stopLoading={() => setLoading(false)}
                resetCheckoutId={() => setCheckoutId(' ')}
                transactionError={mpesaError}
                close={() => setMpesaError()}
                collection="subscriptions"
            />
            <Typography variant='caption'>You will get an Mpesa prompt on your phone.</Typography>
        </StyledBox>
    )
}

export default UpdateSubscription