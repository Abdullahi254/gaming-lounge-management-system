import React, { useEffect, useState, useRef } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Typography, TextField, IconButton, Alert } from '@mui/material';
import { projectFireStore as db } from '../../../firebase/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    padding: 20,
    margin: 10,
    borderRadius: 20,
    maxHeight: 400
}))


function StatementTable() {
    const { currentUser } = useAuth()
    const [statements, setStatements] = useState([])
    const [error, setError] = useState()
    const date1 = useRef()
    const date2 = useRef()
    const [disabledStatus, setDisabledStatus] = useState(true)
    const [search, setSearch] = useState(false)
    useEffect(() => {
        function fetchStatements() {
            //fetching statements from the database using authenticated user's credentials
            const query = db.collection(`users/${currentUser.uid}/statements`).orderBy('date', 'desc').limit(7)
            query.onSnapshot(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log('No matching documents')
                    setError('No matching documents!')
                    return
                }
                setStatements(querySnapshot.docs.map(doc => doc.data()))
            }, err => {
                console.log(err)
                setError('Error Fetching Statements')
            })
        }

        fetchStatements()
        return () => {
            setStatements([])
        }
    }, [currentUser])


    const searchStatements = async () => {
        setError()
        setSearch(true)
        try {
            const input1 = new Date(date1.current.value)
            const input2 = new Date(date2.current.value)
            const now = new Date()
            input1.setHours(0,0,0,0)
            input2.setTime(now.getTime())
            const statementsQueryRes = await db.collection(`users/${currentUser.uid}/statements`).where('date', '>=', input1).where('date', '<=', input2).get()
            if (statementsQueryRes.empty) {
                setError('No matching documents for selected date')
                return
            }
            setStatements(statementsQueryRes.docs.map(stmt => stmt.data()))
        } catch (er) {
            console.log(er)
            setError('Error Fetching Statements')
        }
    }

    const searchButtonHandler = () => {
        if (date1.current.value.length !== 0 && date2.current.value.length !== 0) {
            setDisabledStatus(false)
        }
        else {
            setDisabledStatus(true)
        }
    }

    return (
        <StyledTableContainer component={Paper}>
            <Typography variant='h5' align='center' sx={{ marginBottom: 1, textDecoration: 'underline' }}>
                {!search ? 'Latest Sales.' : 'Selected Date Sales.'}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <TextField type="date" size='small' color='secondary' sx={{ mx: .25 }} inputRef={date1} onChange={searchButtonHandler} />
                <TextField type="date" size='small' color='secondary' sx={{ mx: .25 }} inputRef={date2} onChange={searchButtonHandler} />
                <IconButton onClick={searchStatements} disabled={disabledStatus}>
                    <SearchIcon fontSize='large' />
                </IconButton>
            </div>
            {
                error ?
                    <Alert severity="error" sx={{justifyContent:'center'}}>{error}</Alert>
                    :
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow >
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>TYPE</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>DATE</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>AMOUNT&nbsp;(KSH)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>FROM</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>RECEIPT NUMBER</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {statements.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="right">{row.type}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.date.toDate().toString().split(' G')[0]}
                                    </TableCell>
                                    <TableCell align="right">{row.amount.toFixed(2)}</TableCell>
                                    <TableCell align="right">{row.from}</TableCell>
                                    <TableCell align="right">{row.receiptNumber}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            }

        </StyledTableContainer>
    )
}

export default StatementTable
