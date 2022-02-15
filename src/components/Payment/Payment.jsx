import * as React from 'react';
import { Box, Typography, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import SelectComp from './SelectComp';
import MpesaComp from './MpesaComp';
import CashComp from './CashComp';
import { useParams } from 'react-router-dom';
import { projectFireStore as db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios'
import { Buffer } from 'buffer'
const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: '800px',
    margin: 'auto',
    marginTop: 5,
    borderRadius: '20px'
}))


function Payment() {
    const [type, setType] = React.useState('Mpesa');
    const [total, setTotal] = React.useState(0);
    const [showText, setShowText] = React.useState(true)
    const [success, setSuccess] = React.useState()
    const [error, setError] = React.useState()
    const [accessToken, setAccessToken] = React.useState()
    const [isInvalid, setIsInvalid] = React.useState(true)
    const { time, price } = useParams()

    const amountRef = React.useRef()
    const mpesaRef = React.useRef()

    const { currentUser } = useAuth()

    React.useEffect(() => {
        const minutes = time / 60000
        setTotal(Math.round(minutes * price))
    }, [time, price])

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
            setError('Something went wrong (Token Error)')
            console.log(er)
        })
    }, [])

    const handleChange = (value) => {
        setType(value)
    }

    const handleCashSale = async (e) => {
        e.preventDefault()
        try {
            const event = new Date()
            const month = event.getMonth()
            const year = event.getFullYear()
            await db.collection(`users/${currentUser.uid}/statements`)
                .add({
                    amount: parseInt(total),
                    date: event,
                    from: 'anonymous',
                    month,
                    receiptNumber: Math.random().toString(36).replace('0.', ''),
                    type: "Cash",
                    viewed: false,
                    year
                })
            setSuccess("Created SuccessFully")

        } catch (er) {
            console.log(er)
            setError("Failed To Create a Sale!")
        }
    }

    const handleMpesaPrompt = (e) => {
        e.preventDefault()
        setError()
        if (!isInvalid) {
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
            const amount = total.toString()
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
                    "CallBackURL": `https://us-central1-gaming-payment-system-dev.cloudfunctions.net/lipanamobile/${currentUser.uid}`,
                    "AccountReference": "Gaming Lounge Payment System",
                    "TransactionDesc": "GAMING SERVICE"
                }
            }).then(res => {
                console.log(res)
            }).catch(er => {
                console.log('error sending spt')
                console.log(er)
                setError('something went wrong (SPT error)')
            })
        }
    }

    const toogledit = async () => {
        await setShowText(prev => !prev)
        amountRef.current.focus()
    }

    const saveAmount = (e) => {
        setShowText(true)
        setTotal(parseInt(e.target.value))
    }

    const resetSuccessErrorStates = () => {
        setSuccess()
        setError()
    }

    // using regex to validate phone number povided
    function checkValidity(e) {
        let num = e.target.value
        const regx = /^\d{9}$/
        if (regx.test(num)) {
            setIsInvalid(false)
        }
        else setIsInvalid(true)
    }

    return (
        <StyledBox>
            <Typography variant='h5' align='center' my={2}>
                Amount Totals To:
            </Typography>
            <Typography
                variant='h3'
                align='center'
                gutterBottom
                sx={
                    {
                        cursor: 'pointer',
                        display: showText ? 'block' : 'none'
                    }
                }
                onClick={toogledit}
            >
                KSH.{total.toFixed(2)}
            </Typography>
            <TextField
                id="outlined-amount"
                label="Edit Amount"
                variant="standard"
                defaultValue={Math.round((time / 60000) * price)}
                type="number"
                inputRef={amountRef}
                sx={{
                    display: !showText ? 'block' : 'none',
                    marginRight: 1,
                    my: 1
                }}
                inputProps={{
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                    },
                    onBlurCapture: saveAmount,
                    onKeyPress: (e) => {
                        if (e.key === "Enter") {
                            setShowText(true)
                        }
                    }
                }}


            />

            <SelectComp
                type={type}
                handleSelectChange={(value) => handleChange(value)}
            />

            {type === "Mpesa" && <MpesaComp
                mpesaRef={mpesaRef}
                mpesaPrompt={handleMpesaPrompt}
                handleChange={checkValidity}
                error={isInvalid}
            />}
            {type === "Cash" &&
                <CashComp
                    amount={total.toFixed(2)}
                    cashSale={handleCashSale}
                    success={success}
                    error={error}
                    close={resetSuccessErrorStates}
                />}
        </StyledBox>
    )
}

export default Payment;
