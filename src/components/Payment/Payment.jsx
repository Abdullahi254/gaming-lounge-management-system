import * as React from 'react';
import { Box, Typography, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import SelectComp from './SelectComp';
import MpesaComp from './MpesaComp';
import CashComp from './CashComp';
import { useParams } from 'react-router-dom'

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

    const { time, price } = useParams()

    React.useEffect(() => {
        const minutes = time / 60000
        setTotal(Math.round(minutes * price))
    }, [time, price])

    const handleChange = (value) => {
        setType(value)
    }

    const handleCashSale = () => {

    }

    const toogledit = () => {
        setShowText(prev => !prev)
    }

    const saveAmount = (e) => {
        setShowText(true)
        setTotal(parseInt(e.target.value))
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
                onKeyPress={(e)=>{
                    if(e.key === "Enter"){
                        setShowText(true)
                    }
                }}
            />

            <SelectComp
                type={type}
                handleSelectChange={(value) => handleChange(value)}
            />
            {type === "Mpesa" && <MpesaComp />}
            {type === "Cash" && <CashComp amount={total.toFixed(2)} cashSale={handleCashSale} />}
        </StyledBox>
    )
}

export default Payment;
