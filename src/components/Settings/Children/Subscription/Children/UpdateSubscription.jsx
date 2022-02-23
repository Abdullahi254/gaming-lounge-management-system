import React from 'react';
import { StyledBox, DateContainer as MiniContainer, DateItem as Item } from './SubscriptionCard';
import { Box, Slider, Typography } from '@mui/material';
import MpesaComp from '../../../../Payment/MpesaComp';
import axios from 'axios';
import {useAuth} from '../../../../../contexts/AuthContext';
import { Buffer } from 'buffer';

function UpdateSubscription() {
    const [month, setMonth] = React.useState(1)
    const [price, setPrice] = React.useState(500)
    const [isInvalid, setIsInvalid] = React.useState(true)
    const [requestId, setRequestId] = React.useState(' ')
    const [loading, setLoading] = React.useState(false)
    const [mpesaError, setMpesaError] = React.useState()
    const [accessToken, setAccessToken] = React.useState()

    const { currentUser } = useAuth()
    const mpesaRef = React.useRef()

    // generating auth token for safaricom api request
    React.useEffect(() => {
        const tokenUrl = "/oauth/v1/generate?grant_type=client_credentials"
        const auth = "Basic " + Buffer(process.env.REACT_APP_SAFARICOM_CONSUMER_KEY + ':' + process.env.REACT_APP_SAFARICOM_CONSUMER_SECRET).toString("base64")
        axios({
            method: 'get',
            url: tokenUrl,
            headers: {
                "Authorization": auth
            }
        }).then((res) => {
            console.log('access token aquired')
            setAccessToken(res.data.access_token)
        }).catch(er => {
            setMpesaError('Something went wrong (Token Error)')
            console.log(er)
        })
        return ()=>{
            setAccessToken()
            setMpesaError()
        }
    }, [])

    const handleMpesaPrompt = (e) => {
        e.preventDefault()
        setMpesaError()
        setRequestId(' ')
        if (!isInvalid) {
            setLoading(true)
            setTimeout(()=>{
                setLoading(false)
            },60000)
            const url = "/mpesa/stkpush/v1/processrequest"
            const shortCode = process.env.REACT_APP_SAFARICOM_SHORTCODE.toString()
            const passKey = process.env.REACT_APP_SAFARICOM_PASSKEY.toString()
            const event = new Date()
            const year = event.getFullYear().toString()
            let month = event.getMonth() + 1
            month = month.toString()
            if (month.length < 2) month = '0' + month
            let date = event.getDate().toString()
            if (date.length < 2) date = '0' + date
            let hour = event.getHours().toString()
            if (hour.length < 2) hour = '0' + hour
            let minutes = event.getMinutes().toString()
            if (minutes.length < 2) minutes = '0' + minutes
            let seconds = event.getSeconds().toString()
            if (seconds.length < 2) seconds = '0' + seconds
            const timeStamp = year + month + date + hour + minutes + seconds
            console.log(timeStamp)
            const password = Buffer(shortCode + passKey + timeStamp).toString("base64")
            console.log(password)
            const amount = price.toString()
            console.log(amount)
            const phone = "254" + mpesaRef.current.value.toString()
            console.log(phone)
            axios({
                method: 'post',
                url,
                headers: {
                    "Authorization": "Bearer " + accessToken,
                    "Content-Type": "application/json"
                },
                data: {
                    "BusinessShortCode": shortCode,
                    "Password": password,
                    "Timestamp": timeStamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": amount,
                    "PartyA": phone,
                    "PartyB": shortCode,
                    "PhoneNumber": phone,
                    "CallBackURL": `https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/subscribe/${currentUser.uid}`,
                    "AccountReference": "Gaming Lounge Payment System",
                    "TransactionDesc": "GAMING SERVICE"
                }
            }).then(res => {
                console.log(res)
                setRequestId(res.data.MerchantRequestID)
            }).catch(er => {
                console.log('error sending spt')
                console.log(er)
                setMpesaError('something went wrong. Another transaction might be processing!')
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
          let price = (newValue * 500)
          if(newValue !== 1){
            price = (90/100 * price)
            setPrice(price)
          }else setPrice(price)
          
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
                mpesaRef={mpesaRef}
                mpesaPrompt={handleMpesaPrompt}
                handleChange={checkValidity}
                error={isInvalid}
                requestId={requestId}
                loading={loading}
                stopLoading={()=>setLoading(false)}
                resetRequestId={()=>setRequestId(' ')}
                transactionError={mpesaError}
                close={()=>setMpesaError()}
                sx={{
                    width:'100%',
                    padding:0,
                    boxShadow:0
                }}
            />
            <Typography variant='caption'>You will get an Mpesa prompt on your phone.</Typography>
        </StyledBox>
    )
}

export default UpdateSubscription