import * as React from 'react';
import { Box, Typography, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import SelectComp from './SelectComp';
import MpesaComp from './MpesaComp';
import CashComp from './CashComp';
import { useParams } from 'react-router-dom';
import { projectFireStore as db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import NotFound from '../404/NotFound'
const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    maxWidth: '800px',
    margin: 'auto',
    marginTop: 0,
    borderRadius: '20px'
}))


function Payment() {
    const [hasSubed, setHasSubed] = React.useState(false)
    const [type, setType] = React.useState('Mpesa');
    const [total, setTotal] = React.useState(0);
    const [showText, setShowText] = React.useState(true)
    const [success, setSuccess] = React.useState()
    const [error, setError] = React.useState()
    const [isInvalid, setIsInvalid] = React.useState(true)
    const [checkoutId, setCheckoutId] = React.useState(' ')
    const [loading, setLoading] = React.useState(false)
    const [mpesaError, setMpesaError] = React.useState()
    const { time, price } = useParams()

    const amountRef = React.useRef()
    const mpesaRef = React.useRef()

    const { currentUser } = useAuth()

    React.useEffect(() => {
        const minutes = time / 60000
        setTotal(Math.round(minutes * price))
        return () => setTotal()
    }, [time, price])

    React.useEffect(() => {
        currentUser.getIdTokenResult().then((idTokenResult) => {
            setHasSubed(idTokenResult.claims.premium)
        })
        return () => setHasSubed(false)
    }, [currentUser])

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
        setMpesaError()
        setCheckoutId(' ')
        if (!isInvalid) {
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 60000)
            axios({
                method: 'post',
                url: "https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/api/game/pay",
                data: {
                    email: currentUser.email,
                    amount: total,
                    phone: mpesaRef.current.value
                }
            }).then(res => {
                console.log(res)
                setCheckoutId(res.data.CheckoutRequestID);

            }).catch(er => {
                setMpesaError("Error sending request!(Might be processing another trans).")
                setLoading(false)
                console.log(er.message)
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
        <>
            {
                hasSubed ? <StyledBox>
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
                        checkoutId={checkoutId}
                        loading={loading}
                        stopLoading={() => setLoading(false)}
                        resetCheckoutId={() => setCheckoutId(' ')}
                        transactionError={mpesaError}
                        close={() => setMpesaError()}
                        info="Insert Mpesa Phone Number."
                        collection="statements"
                    />}
                    {type === "Cash" &&
                        <CashComp
                            amount={total.toFixed(2)}
                            cashSale={handleCashSale}
                            success={success}
                            error={error}
                            close={resetSuccessErrorStates}
                        />}
                </StyledBox> :
                    <NotFound />
            }
        </>

    )
}

export default Payment;
