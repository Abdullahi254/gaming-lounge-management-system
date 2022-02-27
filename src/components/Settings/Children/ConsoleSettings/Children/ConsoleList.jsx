import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell, Paper, Button, Typography, Alert, TableContainer } from '@mui/material'
import { projectFireStore as db } from '../../../../../firebase/firebase'
import { useAuth } from '../../../../../contexts/AuthContext'
import UpdateConsoleForm from './UpdateConsoleForm';
import { styled } from '@mui/material/styles';

 const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    padding: 20,
    margin: 10,
    marginTop:0,
    borderRadius: 20,
    [theme.breakpoints.down('xl')]:{
        maxHeight:390,
        marginBottom:0,
        marginTop:-10
    }
}))

function ConsoleList() {
    const [consoles, setConsoles] = useState([])
    const { currentUser } = useAuth()
    const [error, setErrorMessage] = useState('')
    const [openPopup, setOpenPopup] = useState(false)
    const [selectedName, setName] = useState('')
    const [selectedBrand, setBrand] = useState('')
    const [selectedGeneration, setGeneration] = useState('')
    const [selectedPrice, setPrice] = useState('')
    const [selectedConsoleId, setConsoleId] = useState()
    useEffect(() => {
        //fetch name, brand and generation from database
        function getConsoles() {
            const query = db.collection(`users/${currentUser.uid}/consoles`)
            query.onSnapshot(querySnapshot => {
                const consoleList = querySnapshot.docs.map(doc => {
                    return (
                        {
                            id: doc.id,
                            ...doc.data()
                        }
                    )
                })
                setConsoles(consoleList)
            }, err => {
                setErrorMessage('Something went wrong fetching your consoles!')
            })
        }
        getConsoles()
        return () => {
            setConsoles([])
        }
    }, [currentUser])

    const handleClose = () => {
        setOpenPopup(false)
    }

    const handleOpen = (console) => {
        setOpenPopup(true)
        setName(console.name)
        setBrand(console.brand)
        setGeneration(console.generation)
        setPrice(console.price)
        setConsoleId(console.id)
    }

    async function deleteConsoleHandler(id) {
        //delete a console document from cloud firestore
        try {
            await db.collection(`users/${currentUser.uid}/consoles`).doc(id).delete()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <UpdateConsoleForm
                handleClose={handleClose}
                open={openPopup}
                name={selectedName}
                brandProp={selectedBrand}
                generationProp={selectedGeneration}
                price={selectedPrice}
                id={selectedConsoleId}
            />
            <StyledTableContainer component={Paper}>
                <Typography variant='h6' align='center' sx={{ marginBottom: 1, textDecoration: 'underline' }}>
                    Console List.
                </Typography>
                {error && <Alert severity="error" sx={{ justifyContent: 'center' }}>{error}</Alert>}
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Console Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Brand</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Generation</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }} align='center' >Price/Min(KSH)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline' }} align='center'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {consoles.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell >{row.name}</TableCell>
                                <TableCell >{row.brand}</TableCell>
                                <TableCell >{row.generation}</TableCell>
                                <TableCell align='center'>{row.price}</TableCell>
                                <TableCell align='center'>
                                    <Button color='success' size='small' sx={{ mx: 1 }} onClick={() => handleOpen(row)}>Update</Button>
                                    <Button color='secondary' size='small' sx={{ mx: 1 }} onClick={() => deleteConsoleHandler(row.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </>
    )

}

export default ConsoleList;
