import React, { useState, useRef, useEffect } from 'react'
import { Box, TextField, MenuItem, Button, Alert } from '@mui/material'
import { styled } from '@mui/material/styles';
import BackDrop from '../../BackDrop/BackDrop';
import { projectFireStore as db } from '../../../firebase/firebase'
import { useAuth } from '../../../contexts/AuthContext'

export const StyledBox = styled(Box)(({ theme }) => ({
    position: 'fixed',
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    borderRadius: '30px',
    flexWrap: 'wrap',
    minHeight: '200px',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndex.drawer + 10,
    top: '20%'
}))



const types = ["Mpesa", "Cash"]

function SalesForm({ open, handleClose }) {
    const [type, setType] = useState("Cash")
    let fromRef = useRef()
    const amountRef = useRef()
    const mpesaRef = useRef()

    const [fromError, setFromError] = useState(true)
    const [mpesaRefError, setMpesaRefError] = useState(true)
    const [success, setSuccess] = useState()
    const [error, setError] = useState()
    
    const { currentUser } = useAuth()

    const handleChange = (event) => {
        setType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSuccess()
        setError()
        try {
            if (!fromError && !mpesaRefError) {
                const event = new Date()
                const month = event.getMonth()
                const year = event.getFullYear()

                await db.collection(`users/${currentUser.uid}/statements`)
                    .add({
                        amount: parseInt(amountRef.current.value),
                        date: event,
                        from: fromRef.current.value,
                        month,
                        receiptNumber: type === "Cash" ?
                            Math.random().toString(36).replace('0.', '').toUpperCase() :
                            mpesaRef.current.value
                        ,
                        type: type,
                        viewed: false,
                        year
                    })
                setSuccess("Created SuccessFully")
            } else throw new Error("Internal Error! Report to Admin ASAP.")
        } catch (er) {
            console.log(er)
            setError("Failed To Create a Sale!")
        }

    }

    const numberCheck = () => {
        if (type === "Mpesa") {
            if (/^[071]{2}\d{8}$/.test(fromRef.current.value)) {
                setFromError(false)
            } else setFromError(true)
        }
        else setFromError(false)
    }

    const refCheck = () => {
        if (mpesaRef.current.value.length >= 10) {
            setMpesaRefError(false)
        }
        else {
            setMpesaRefError(true)
        }
    }

    useEffect(() => {
        if (type === "Cash") {
            setFromError(false)
            setMpesaRefError(false)
        }
    }, [type])


    const handleClick = ()=>{
        setSuccess()
        setError()
        handleClose()
    }

    return (
        <>
            <BackDrop
                open={open}
                clicked={handleClick}
            />
            <StyledBox
                sx={{ display: open ? 'flex' : 'none' }}
                component="form"
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                {error && <Alert severity="error" sx={{ justifyContent: 'center', width: '100%' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ justifyContent: 'center', width: '100%' }}>{success}</Alert>}
                <TextField
                    id="outlined-select-type"
                    select
                    label="Type"
                    value={type}
                    onChange={handleChange}
                    sx={{ marginRight: 1, my: 1 }}
                >
                    {types.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    required
                    id="outlined-amount"
                    label="Amount"
                    type="number"
                    sx={{ marginRight: 1, my: 1 }}
                    inputRef={amountRef}
                />

                <TextField
                    error={fromError}
                    required
                    id="outlined-from"
                    label="From"
                    type={type === "Mpesa" ? 'number' : 'string'}
                    sx={{ marginRight: 1, my: 1 }}
                    onChange={numberCheck}
                    inputRef={fromRef}
                    helperText={fromError && 'insert valid phone number'}
                />

                {
                    type === "Mpesa" &&
                    <TextField
                        required
                        id="outlined-RefNumber"
                        label="Mpesa Ref Number"
                        sx={{ marginRight: 1, my: 1 }}
                        onChange={refCheck}
                        inputRef={mpesaRef}
                        error={mpesaRefError}
                        helperText={mpesaRefError && 'must be atleast 10 digits'}
                    />
                }

                <Button type='submit' size='small' color='secondary' >Create Sale</Button>


            </StyledBox>
        </>

    )
}

export default SalesForm
