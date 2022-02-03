import React, { useEffect, useRef, useState } from 'react'
import { Backdrop, Box, Typography, Button, Alert } from '@mui/material'
import { styled } from '@mui/material/styles'
import qrcode from 'qrcode'
import { useReactToPrint } from 'react-to-print'


const StyledBox = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: '15%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '20px',
    backgroundColor: 'white',
    color: 'black',
}))



const StyledImage = styled('img')(({ theme }) => ({
    width: '500px',
    borderRadius: '20px',
    [theme.breakpoints.down('md')]: {
        width: '250px',
        height:'200px'
    },
}))




function QrComponent({ show, close, time, price }) {
    const [url, setUrl] = useState('')
    const contentRef = useRef()
    const [error, setError] = useState('')
    const handlePrint = useReactToPrint({
        content: () => contentRef.current
    })

    useEffect(() => {
        qrcode.toDataURL(`http://192.168.1.6:3000/view-amount/${time}/${price}`,
            {
                errorCorrectionLevel: 'H',
                type: 'image/jpeg',
                width: 500
            }
        )
            .then(url => {
                setUrl(url)
            })
            .catch(er => {
                setError('Error Creating QrCode!')
                console.log(er)
            })
    }, [price, time])

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column' }}
            open={show}
            onClick={close}
        >
            <StyledBox >
                {error && <Alert severity="error" onClose={close}>{error}</Alert>}
                <div ref={contentRef} style={{ textAlign: 'center' }}>
                    <StyledImage src={url} alt="Qrcode" />
                    <Typography>Scan to know amount!</Typography>
                </div>
                <Button onClick={handlePrint} variant="contained" sx={{ my: 1, px: 4 }} color='secondary'>Print</Button>
            </StyledBox>
        </Backdrop>
    )
}

export default QrComponent
