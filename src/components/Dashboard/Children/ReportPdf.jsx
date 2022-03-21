import React from 'react'
import { StyledBox } from './SalesForm'
import BackDrop from '../../BackDrop/BackDrop'
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Button, Typography, Box } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useReactToPrint } from 'react-to-print'
import { tableCellClasses } from "@mui/material/TableCell"
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    padding: 20,
    margin: 10,
    marginTop: 0,
    borderRadius: 10,
    maxHeight: 810,
    [theme.breakpoints.only("xl")]: {
        width: "40%"
    },
    [theme.breakpoints.down("xl")]: {
        width: "60%",
        maxHeight: 580
    },
    [theme.breakpoints.down("md")]: {
        width: "100%"
    },
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
}))
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,

    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

function ReportPdf({ open, handleClick, sales, electBill, subFee, date, other }) {

    const [week1, setWeek1] = React.useState([])
    const [week2, setWeek2] = React.useState([])
    const [week3, setWeek3] = React.useState([])
    const [week4, setWeek4] = React.useState([])
    const [week1Sales, setWeek1Sales] = React.useState({})
    const [week2Sales, setWeek2Sales] = React.useState({})
    const [week3Sales, setWeek3Sales] = React.useState({})
    const [week4Sales, setWeek4Sales] = React.useState({})
    const [gross, setGross] = React.useState()
    const [sub, setSub] = React.useState(0)

    const contentRef = React.useRef()

    React.useEffect(() => {
        const w1 = sales.filter((sale) => {
            return new Date(sale.date.toMillis()).getDate() > 0 && new Date(sale.date.toMillis()).getDate() <= 8
        })
        const w2 = sales.filter((sale) => {
            return new Date(sale.date.toMillis()).getDate() > 8 && new Date(sale.date.toMillis()).getDate() <= 16
        })
        const w3 = sales.filter((sale) => {
            return new Date(sale.date.toMillis()).getDate() > 16 && new Date(sale.date.toMillis()).getDate() <= 24
        })
        const w4 = sales.filter((sale) => {
            return new Date(sale.date.toMillis()).getDate() > 24 && new Date(sale.date.toMillis()).getDate() <= 31
        })
        setWeek1(w1)
        setWeek2(w2)
        setWeek3(w3)
        setWeek4(w4)

    }, [sales])

    React.useEffect(() => {
        let week1Sales = 0
        let week1Amount = 0
        if (week1.length > 0) {
            week1.forEach(sale => {
                week1Sales += 1
                week1Amount += sale.amount
            })
            setWeek1Sales({
                name: "Week 1",
                sales: week1Sales,
                amount: week1Amount
            })
        }

    }, [week1])

    React.useEffect(() => {
        let week2Sales = 0
        let week2Amount = 0
        if (week2.length > 0) {
            week2.forEach(sale => {
                week2Sales += 1
                week2Amount += sale.amount
            })
            setWeek2Sales({
                name: "Week 2",
                sales: week2Sales,
                amount: week2Amount
            })
        }
    }, [week2])

    React.useEffect(() => {
        let week3Sales = 0
        let week3Amount = 0
        if (week3.length > 0) {
            week3.forEach(sale => {
                week3Sales += 1
                week3Amount += sale.amount
            })
            setWeek3Sales({
                name: "Week 3",
                sales: week3Sales,
                amount: week3Amount
            })
        }

    }, [week3])
    React.useEffect(() => {
        let week4Sales = 0
        let week4Amount = 0
        if (week4.length > 0) {
            week4.forEach(sale => {
                week4Sales += 1
                week4Amount += sale.amount
            })
            setWeek4Sales({
                name: "Week 4",
                sales: week4Sales,
                amount: week4Amount
            })
        }
    }, [week4])

    React.useEffect(() => {
        const sales = [week1Sales, week2Sales, week3Sales, week4Sales].filter(obj => {
            return obj.amount
        })
        let total = 0
        sales.forEach(sale => {
            total += sale.amount
        })
        setGross(total)
    }, [week1Sales, week2Sales, week3Sales, week4Sales])

    React.useEffect(() => {
        if (subFee) {
            setSub(subFee)
        }
    }, [subFee])

    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
    })
    return (
        <>
            <BackDrop
                open={open}
                clicked={handleClick}
            />
            <StyledBox
                sx={{
                    display: open ? 'flex' : 'none',
                    borderRadius: '10px',
                    background: 'none',
                    width: "100%",
                    top: "5.2%",
                    padding: 0,
                }}
            >
                <StyledTableContainer component={Paper}>
                    <div ref={contentRef} >
                        <Typography variant='h6' align='center' sx={{ textDecoration: 'underline', color: 'black' }}>{date.month}'s {date.year} SALES REPORT</Typography>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>WEEKS</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>SALES</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>Amount&nbsp;(KSH)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[week1Sales, week2Sales, week3Sales, week4Sales].map((week, index) => (
                                    <TableRow
                                        key={index}
                                    >
                                        <StyledTableCell align="right">{week.name}</StyledTableCell>
                                        <StyledTableCell align="right">{week.sales}</StyledTableCell>
                                        <StyledTableCell align="right">{week.amount === undefined ? '' : week.amount + ".00"}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableBody>
                                <TableRow>
                                    <StyledTableCell align="right"><b>Gross (Total)</b></StyledTableCell>
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right"><b>{gross + ".00"}</b></StyledTableCell>
                                </TableRow>
                            </TableBody>

                            <TableHead>
                                <TableRow >
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>ELECTRICITY BILL</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}></StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>Amount&nbsp;(KSH)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right">-{electBill + ".00"}</StyledTableCell>
                                </TableRow>
                            </TableBody>

                            <TableHead>
                                <TableRow >
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>SUBSCRIPTION FEE</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}></StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>Amount&nbsp;(KSH)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right">-{sub + ".00"}</StyledTableCell>
                                </TableRow>
                            </TableBody>

                            <TableHead>
                                <TableRow >
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>OTHER EXPENSES</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}></StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>Amount&nbsp;(KSH)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right">-{other + ".00"}</StyledTableCell>
                                </TableRow>
                            </TableBody>

                            <TableHead>
                                <TableRow >
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>NET (TOTAL)</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}></StyledTableCell>
                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>Amount&nbsp;(KSH)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right"></StyledTableCell>
                                    <StyledTableCell align="right">{(gross - electBill - sub - other) + ".00"}</StyledTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <Box component="div" sx={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                        <Button color='error' onClick={handleClick}>CLOSE</Button>
                        <Button color='success' onClick={handlePrint}>PRINT</Button>
                    </Box>
                </StyledTableContainer>
            </StyledBox>
        </>
    )
}

export default ReportPdf