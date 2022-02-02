import React, { useState, useEffect } from 'react'
import ConsoleBox from '../ConsoleBox/ConsoleBox'
import { Box, CircularProgress as Spinner, Typography, Alert } from '@mui/material'
import { projectFireStore as db } from '../../firebase/firebase'
import {useAuth} from '../../contexts/AuthContext'
import QrComponent from '../QrComponent/QrComponent'
import {useNavigate} from 'react-router-dom' 

function ActiveConsoles() {
    const {currentUser} = useAuth()
    const [loading, setLoading] = useState(true)
    const [consoles, setConsoles] = useState([])
    const [error, setError] = useState()
    const [time, setTime] = useState(0)
    const [qrComponent, showQrComponent] = useState(false)
    const [qrConsole, setQrConsole] = useState('')
    let navigate = useNavigate()

    useEffect(() => {
        // fetching consoles data from firebase
        function getConsoles() {
            const query = db.collection(`users/${currentUser.uid}/consoles`).where('active', '==', true)
            query.onSnapshot(querySnapshot => {
                setConsoles(querySnapshot.docs.map(doc => doc.data()))
                setLoading(false)
            }, err => {
                setError('Something went wrong fetching your consoles!')
                setLoading(false)
            })
        }
        getConsoles()

        return () => {
            setConsoles([])
        }

    }, [currentUser])

    //change console state from active to idle and viceversa
    async function ejectHandler(name) {
        try {
            const consoleRef = await db.collection(`users/${currentUser.uid}/consoles`).where('name', '==', name).get()
            consoleRef.forEach((doc) => doc.ref.update({
                active: false,
                startTime: '00:00:00'
            }))
        } catch (er) {
            setError('Failed to Eject Console')
            console.log(er)
        }
    }

    // the function below takes time information from ConsoleInfo, which is later fed into the QrComponent to produce a qrcode
    function qrCodeHandler(time, index) {
        showQrComponent(true)
        setTime(time)
        setQrConsole(consoles[index])
    }

    //this function also take time info and sends it to the payment page via url parameter together with price/min charges
    function paymmentHandler(time, index) {
        navigate(`/activeconsoles/payment/${time}/${consoles[index].price}`);
    }

    //handles unmounting of qrcomponent on click of close button
    function closeQrComponentHandler() {
        showQrComponent(false)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my:4 }}>
            {error && <Alert severity="error" sx={{justifyContent:'center'}}>{error}</Alert>}
            {qrComponent && <QrComponent show={qrComponent} close={closeQrComponentHandler} name={qrConsole.name} time={time} price={qrConsole.price}/> }
            {
                loading ? <Box sx={{ height: '500px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}><Spinner color="inherit" size={200} thickness={1} /></Box> :
                    consoles.length < 1 ? <Typography sx={{color:(theme)=>theme.palette.secondary.main}}>No Active Consoles Found!</Typography> :
                        consoles.map((obj, index) => {
                            return (
                                <ConsoleBox name={obj.name} key={index} activeIcons={true} eject={() =>ejectHandler(obj.name)}
                                    qrCode={(time) => qrCodeHandler(time, index)} pay={(time) => paymmentHandler(time, index)} />
                            )
                        })
            }

        </Box>
    )
}

export default ActiveConsoles
