import * as React from 'react';
import { Box, Typography, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import SelectComp from './SelectComp';
import MpesaComp from './MpesaComp';
import CashComp from './CashComp';
import { useParams } from 'react-router-dom';
import { projectFireStore as db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: '800px',
    margin: 'auto',
    marginTop: 50,
    borderRadius: '20px'
}))


function Payment() {
    const [type, setType] = React.useState('Mpesa');
    const [total, setTotal] = React.useState(0);
    const [showText, setShowText] = React.useState(true)
    const [success, setSuccess] = React.useState()
    const [error, setError] = React.useState()
    const { time, price } = useParams()

    const { currentUser } = useAuth()

    React.useEffect(() => {
        const minutes = time / 60000
        setTotal(Math.round(minutes * price))
    }, [time, price])

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

    const toogledit = () => {
        setShowText(prev => !prev)
    }

    const saveAmount = (e) => {
        setShowText(true)
        setTotal(parseInt(e.target.value))
    }

    const resetSuccessErrorStates = () => {
        setSuccess()
        setError()
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
                sx={{
                    display: !showText ? 'block' : 'none',
                    marginRight: 1,
                    my: 1
                }}
                inputProps={{
                    style: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }
                }}
                onBlur={saveAmount}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        setShowText(true)
                    }
                }}
            />

            <SelectComp
                type={type}
                handleSelectChange={(value) => handleChange(value)}
            />

            {type === "Mpesa" && <MpesaComp />}
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
