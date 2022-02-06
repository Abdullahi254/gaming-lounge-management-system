import React, { useState, useRef } from 'react';
import { TextField, MenuItem, Box, Button, Alert } from '@mui/material'
import { styled } from '@mui/material/styles';
import { projectFireStore as db } from '../../../firebase/firebase';
import { useAuth } from '../../../contexts/AuthContext';

const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    borderRadius: '20px',
    flexWrap: 'wrap',
    minHeight: '150px',
    alignItems: 'center',
    justifyContent: 'center',
    top: '20%',
    margin: 30
}))

const brands = ["X-Box", "PlayStation"]
const xbox = ["X-Box 360", "X-Box one", "X-Box Series X"]
const ps = ["PlayStation 3", "PlayStation 4", "Playstation 5"]

function AddConsoleForm({ name, brandProp, generationProp, price, popup, sx, id }) {
    const [brand, setBrand] = useState("X-Box")
    const [generation, setGeneration] = useState("X-Box 360")
    const [nameError, setNameError] = useState()
    const [priceError, setPriceError] = useState()
    const [success, setSuccess] = useState()
    const [error, setError] = useState()
    const [brandPropState, setBrandPropState] = useState(brandProp)
    const [generationPropState, setGenerationPropState] = useState(generationProp)

    const nameRef = useRef()
    const amountRef = useRef()

    const { currentUser } = useAuth()

    const handleBrandChange = (event) => {
        setBrand(event.target.value);
        setBrandPropState(event.target.value)
        if (event.target.value === "X-Box") {
            setGeneration("X-Box 360")
            setGenerationPropState("X-Box 360")
        } else {
            setGeneration("PlayStation 3")
            setGenerationPropState("PlayStation 3")
        }
    };

    const handleGenerationChange = (event) => {
        setGeneration(event.target.value);
        setGenerationPropState(event.target.value)
    };


    const nameChangeHandler = (e) => {
        if (e.target.value.length < 3) {
            setNameError(true)
        }
        else {
            setNameError(false)
        }
    }

    const handlePriceChange = (e) => {
        if (e.target.value < 1) {
            setPriceError(true)
        } else {
            setPriceError(false)
        }
    }

    async function saveConsoleHandler(e) {
        e.preventDefault()
        if (!nameError && !priceError) {
            const consoleData = {
                name: nameRef.current.value,
                brand: brand,
                generation: generation,
                price: parseInt(amountRef.current.value),
                active: false,
                startTime: '00:00:00'
            }
            try {
                await db.collection(`users/${currentUser.uid}/consoles`).add(consoleData)
                setSuccess('successfully added console!')
                e.target.reset();
            } catch (er) {
                console.log(er)
                setError('Error adding console!')
            }
        }
    }

    async function updateConsole(e) {
        e.preventDefault()
        /// updating the database with new console data
        try {
            const consoleRef = db.collection(`users/${currentUser.uid}/consoles`).doc(id)
            await consoleRef.update({
                name: nameRef.current.value,
                brand: brand,
                generation: generation,
                price: amountRef.current.value,
            })
            setSuccess('Successfuly Updated Console!')
            e.target.reset();
        } catch (error) {
            setError("Error Updating Console!")
            console.log(error)
        }
    }

    const resetError = () => {
        setSuccess()
        setError()
    }

    return (
        <StyledBox
            component="form"
            onSubmit={popup ? updateConsole : saveConsoleHandler}
            autoComplete="off"
            sx={sx}
        >
            {success && <Alert severity="success" sx={{ justifyContent: 'center', width: '100%', my: 1 }} onClose={resetError}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ justifyContent: 'center', width: '100%' }} onClose={resetError}>{error}</Alert>}
            <TextField
                required
                id="outlined-select-consoleName"
                label="Console Name"
                sx={{ marginRight: 1, my: 1 }}
                inputRef={nameRef}
                placeholder={name}
                error={nameError}
                helperText={nameError && 'Name must have atleast 3 characters!'}
                onChange={nameChangeHandler}
            />
            <TextField
                id="outlined-select-Brand"
                select
                label="Brand"
                value={brandPropState || brand}
                onChange={handleBrandChange}
                sx={{ marginRight: 1, my: 1 }}
            >
                {brands.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                id="outlined-select-Generation"
                select
                label="Generation"
                value={generationPropState || generation}
                onChange={handleGenerationChange}
                sx={{ marginRight: 1, my: 1 }}
            >
                {
                    (brandPropState || brand) === "X-Box" ?
                        xbox.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        )) :
                        ps.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))
                }
            </TextField>

            <TextField
                required
                id="outlined-select-price"
                label="Price per Min"
                sx={{ marginRight: 1, my: 1 }}
                inputRef={amountRef}
                type="number"
                placeholder={price}
                error={priceError}
                helperText={priceError && 'price can not be less than 1 :{'}
                onChange={handlePriceChange}
            />

            <Button type='submit' size='small' color='success' sx={{ py: 3 }}>{popup ? "Update" : "Add Console"}</Button>

        </StyledBox>
    )
}

export default AddConsoleForm;
