import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Typography, TextField, IconButton, Alert, Collapse, Box } from '@mui/material';
import { projectFireStore as db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { ExpandMore } from '../Settings/Children/Account/children/EmailPasswordCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import logo from '../../assets/imgs/logo.png'

const StyledImg = styled('img')(({ theme }) => ({
    height: theme.spacing(10),
    marginRight:30,
    [theme.breakpoints.down('md')]: {
        height: theme.spacing(8)
    },
    borderRadius:5,
    filter: theme.palette.mode === 'light' ? 'invert(100%)' : 'invert(20%)'
}))

export const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
    margin: 'auto',
    maxWidth: '1200px',
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    padding: 20,
    margin: 30,
    borderRadius: 20,
    maxHeight: 550,
    minHeight: 400
}))


function Receipts() {
    const { currentUser } = useAuth()
    const [statements, setStatements] = useState([])
    const [error, setError] = useState()
    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [search, setSearch] = useState(false)
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        function fetchStatements() {
            //fetching statements from the database using authenticated user's credentials
            const query = db.collection(`users/${currentUser.uid}/subscriptions`).orderBy('date', 'desc').limit(5)
            query.onSnapshot(querySnapshot => {
                if (querySnapshot.empty) {
                    console.log('No matching documents')
                    setError('No matching documents!')
                    return
                }
                setStatements(querySnapshot.docs.map(doc => doc.data()))
            }, err => {
                console.log(err)
                setError('Error Fetching Receipts')
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
            const input1 = new Date(date1)
            const input2 = new Date(date2)
            const now = new Date()
            const hour = now.getHours()
            const minutes = now.getMinutes()
            const seconds = now.getSeconds()
            input1.setHours(0, 0, 0, 0)
            input2.setHours(hour, minutes, seconds)
            const statementsQueryRes = await db.collection(`users/${currentUser.uid}/subscriptions`).where('date', '>=', input1).where('date', '<=', input2).get()
            if (statementsQueryRes.empty) {
                setError('No matching documents for selected date')
                return
            }
            setStatements(statementsQueryRes.docs.map(stmt => stmt.data()))
        } catch (er) {
            console.log(er)
            setError('Error Fetching receipts')
        }
    }


    return (
        <StyledContainer>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StyledTableContainer component={Paper}>
                    <Typography component='div'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            marginBottom:5
                        }}>
                        <StyledImg src={logo} alt="logo" />
                        <Typography component='div'
                        sx={{
                            display: 'flex',
                            flexDirection:'column',
                        }}>
                            <Typography variant='subtitle1'>Aim Labs KE</Typography>
                            <Typography variant='subtitle1'>P.O. Box 4778-30100</Typography>
                            <Typography variant='subtitle1'>Eldoret, Kenya.</Typography>

                        </Typography>
                    </Typography>
                    <Typography
                        component='div'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Typography variant='h6' sx={{ marginBottom: 2, textDecoration: 'underline' }}>
                            {!search ? 'Receipts.' : 'Selected Date Receipts.'}
                        </Typography>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                            size='small'
                            sx={{ marginBottom: 2 }}
                        >
                            {!expanded && 'Search'}
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Typography>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <MobileDatePicker
                                inputFormat="dd/MM/yyyy"
                                label="From"
                                placeholder="select date"
                                onChange={(newval) => setDate1(newval)}
                                value={date1}
                                renderInput={(params) => <TextField
                                    {...params}
                                    sx={{ mx: .25 }}
                                    size='small'
                                    color='secondary'
                                />}
                            />

                            <MobileDatePicker
                                inputFormat="dd/MM/yyyy"
                                label="To"
                                onChange={(newval) => setDate2(newval)}
                                value={date2}
                                renderInput={(params) => <TextField
                                    {...params}
                                    sx={{ mx: .25 }}
                                    size='small'
                                    color='secondary'
                                />}
                            />

                            <IconButton onClick={searchStatements}>
                                <SearchIcon />
                            </IconButton>
                        </div>
                    </Collapse>
                    {
                        error ?
                            <Alert severity="error" sx={{ justifyContent: 'center' }}>{error}</Alert>
                            :
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow >
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>REFERENCE</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>DATE</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>AMOUNT&nbsp;(KSH)</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>SUB PERIOD</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {statements.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="right">{row.receiptNumber}</TableCell>
                                            <TableCell component="th" scope="row" align='right'>
                                                {row.date.toDate().toString().split(' G')[0]}
                                            </TableCell>
                                            <TableCell align="right">{row.amount.toFixed(2)}</TableCell>
                                            <TableCell align="right">{row.period} month(s)</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                    }
                </StyledTableContainer>
            </LocalizationProvider>
        </StyledContainer>
    )
}

export default Receipts
