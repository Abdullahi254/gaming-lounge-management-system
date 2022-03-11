import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material';
function CustomAdminForm({ submit, label, days }) {
    const textRef = React.useRef()
    const daysRef = React.useRef()
    const handleSubmit = (e) => {
        e.preventDefault()
        submit(textRef.current.value)
    }
    const handleSubmit2 = (e) => {
        e.preventDefault()
        submit(textRef.current.value, daysRef.current.value)
    }
    return (
        <Box
            component="form"
            sx={{
                width: '100%',
                margin: 8,
                display: 'flex',
                justifyContent: 'space-between',
            }}
            onSubmit={days ? handleSubmit2 : handleSubmit}
            autoComplete="off"
        >
            {days && <TextField label="days" variant="standard" sx={{ width: '20%' }} inputRef={daysRef} type="number"/>}
            <TextField label={label} variant="standard" sx={{ width: '60%' }} inputRef={textRef} />
            <Button color='success' type='submit' size='large'> Submit </Button>
        </Box>
    )
}

export default CustomAdminForm