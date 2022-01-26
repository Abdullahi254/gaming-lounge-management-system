import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { projectFireStore as db } from '../../firebase/firebase'
import ConsoleBox from '../ConsoleBox/ConsoleBox'
import { Box, Typography, CircularProgress as Spinner, Alert } from '@mui/material'
function IdleConsoles() {
    const [consoles, setConsoles] = useState([])
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)
    const { currentUser } = useAuth()
    useEffect(() => {
        function getConsoles() {
            const query = db.collection(`users/${currentUser.uid}/consoles`).where('active', '==', false)
            query.onSnapshot(querySnapshot => {
                setConsoles(querySnapshot.docs.map(doc => doc.data()))
                setLoading(false)
            }, er => {
                setError("Error fetching Idle consoles!")
                setLoading(false)
            })
        }
        getConsoles()
        return () => {
            setConsoles([])
        }
    }, [currentUser.uid])

    async function activeHandler(name) {
        try {
            const consoleRef = await db.collection(`users/${currentUser.uid}/consoles`).where('name', '==', name).get()
            consoleRef.forEach((doc) => doc.ref.update({
                active: true
            }))
        } catch (er) {
            console.log(er)
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my:4 }}>
            {error && <Alert severity="error" sx={{justifyContent:'center'}}>{error}</Alert>}
            {
                loading ? <Box sx={{ height: '500px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}><Spinner color="inherit" size={200} thickness={1} /></Box> :
                    consoles.length < 1 ? <Typography sx={{ color: (theme) => theme.palette.secondary.main }}>No Idle Consoles Found!</Typography> :
                        consoles.map((obj, index) => {
                            return (
                                <ConsoleBox name={obj.name} key={index} idleIcon={true} addHandler={() => activeHandler(obj.name)} />
                            )
                        })
            }
        </Box>
    )
}

export default IdleConsoles
