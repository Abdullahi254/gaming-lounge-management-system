import React, { useState, useEffect } from 'react'
import { Box, Typography, Tooltip, CircularProgress as Spinner } from '@mui/material'
import { CropFree, PlayArrow, Stop, Payments, Eject, Add } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useAuth } from '../../contexts/AuthContext'
import { projectFireStore as db } from '../../firebase/firebase'
import { grey, } from '@mui/material/colors';

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    margin: '10px 0',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        borderBottom: 'solid 2px black'
    },
}))

const StyledDiv = styled(Typography)(({ theme }) => ({
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    margin: `${theme.spacing(2)} ${theme.spacing(1)}`,
    display: 'flex',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.light,
    [theme.breakpoints.down('md')]: {
        width: '400px',
        margin: `${theme.spacing(2)} 0`,
    },
    [theme.breakpoints.down('sm')]: {
        width: '250px',
        margin: `${theme.spacing(2)} 0`,
    },
    width: '200px',
    justifyContent: 'center'
}))

const IconsDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        margin: '0',
    },
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    margin: `${theme.spacing(2)} ${theme.spacing(1)}`,
}))

const IconButton = styled('button')(({theme})=>({
    padding:0,
    background:theme.palette.background.default,
    border:0,
    color:theme.palette.text.primary,
    "&:disabled":{
        color:theme.palette.mode === 'dark' ? grey[800] : grey[200]
    }
}))

function ConsoleBox({ activeIcons, idleIcon, qrCode, pay, name, eject, addHandler }) {
    const [startTime, setStartTime] = useState('00:00:00')
    const [time, setTime] = useState(0)
    const [timerOn, setTimeOn] = useState(false)
    const [disable, setDisable] = useState(true)
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        function fetchStartTime() {
            const query = db.collection(`users/${currentUser.uid}/consoles`).where('name', '==', name)
            query.onSnapshot(querySnapshot => {
                const rig = querySnapshot.docs.map(doc => doc.data())[0]
                const event = rig.startTime
                if (event !== '00:00:00') {
                    const milli = event.toMillis()
                    const dateObject = new Date(milli)
                    setStartTime(dateObject.toLocaleTimeString('it-IT'))
                    setTimeOn(true)
                    const now = new Date()
                    setTime(now.getTime() - milli)
                }
                setLoading(false)
            }, err => {
                console.log(err)
            })
        }
        fetchStartTime()
        return () => {
            setStartTime('00:00:00')
            setTimeOn(false)
            setTime(0)
        }
    }, [currentUser, name])


    useEffect(() => {
        let interval = null
        if (timerOn) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 10)
            }, 10)
        }
        else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [timerOn])


    useEffect(() => {
        if (disable && (time >= 10000)) {
            setDisable(false)
            return
        }
    }, [time, disable])

    function setStartTimeHandler() {
        const event = new Date()
        setStartTime(event.toLocaleTimeString('it-IT'))
        setTimeOn(true)
        updateTime(event)
    }

    async function updateTime(time) {
        /// updating the database with start time
        try {
            const consoleRef = await db.collection(`users/${currentUser.uid}/consoles`).where('name', '==', name).get()
            consoleRef.forEach((doc) => doc.ref.update({
                startTime: time
            }))
        } catch (error) {
            console.log(error)
        }
    }


    function stopClockHandler() {
        updateTime('00:00:00')
        setStartTime('00:00:00')
        setTimeOn(false)
        setTime(0)
        setDisable(true)
    }

    function qrCodeHandler() {
        qrCode(time)
    }

    function paymentHandler() {
        pay(time)
    }

    return (
        <StyledBox>
            <IconsDiv style={{ display: timerOn ? 'flex' : 'none' }}>
                <CropFree sx={{ cursor: 'pointer' }} onClick={qrCodeHandler} />
            </IconsDiv>
            <StyledDiv component="div">{name}</StyledDiv>
            <Tooltip title="Start TIme">
                <StyledDiv component="div">
                    {loading ? <Spinner color='inherit' size={20} /> : startTime}
                </StyledDiv>
            </Tooltip>
            <Tooltip title="Timer">
                <StyledDiv component="div">
                    {
                        loading ? <Spinner color='inherit' size={20} /> :
                            <>
                                <span>{("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:</span>
                                <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                                <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
                            </>
                    }
                </StyledDiv>
            </Tooltip>
            <IconsDiv style={{ display: activeIcons ? 'flex' : 'none' }}>
                {timerOn ? <Stop sx={{ mx: 1, cursor: 'pointer' }} onClick={stopClockHandler} /> : <PlayArrow onClick={setStartTimeHandler} sx={{ mx: 1, cursor: 'pointer' }} />}
                <IconButton
                    onClick={paymentHandler}
                    disabled={disable}
                >
                    <Payments
                        sx={{
                            mx: 1,
                            cursor: disable ? 'not-allowed' : 'pointer'
                        }}
                    />
                </IconButton>
                <Eject sx={{ mx: 1, cursor: 'pointer' }} onClick={eject} />
            </IconsDiv>
            <IconsDiv style={{ display: idleIcon ? 'flex' : 'none' }}>
                <Add sx={{ cursor: 'pointer' }} onClick={addHandler}/>
            </IconsDiv>
        </StyledBox>
    )
}

export default ConsoleBox
