import React from 'react'
import { StyledBox } from './SalesForm'
import BackDrop from '../../BackDrop/BackDrop'
import { FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Button } from '@mui/material'

function ReportForm({ open, handleClick }) {
    const [month, setMonth] = React.useState(new Date().getMonth() + 1)
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [yearList, setYearList] = React.useState([])
    const electBillRef = React.useRef()

    const handleMonthChange = (e) => {
        setMonth(e.target.value)
    }
    const handleSubmit = () => {
        console.log()``
    }
    const handleYearChange = (e) => {
        setYear(e.target.value)
    }

    const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    React.useEffect(() => {
        const date = new Date()
        const year = date.getFullYear()
        const diff = (year - 2021 + 1)
        let list = []
        for (let i = 0; i < diff; i++) {
            list.push(2021 + i)
        }
        setYearList(list)
    }, [])
    return (
        <>
            <BackDrop
                open={open}
                clicked={handleClick}
            />
            <StyledBox
                sx={{ display: open ? 'flex' : 'none', borderRadius: '20px', }}
                component="form"
                onSubmit={handleSubmit}
            >
                <FormControl sx={{ marginRight: 1,  width: '100px' }}>
                    <InputLabel id="month">Select Month</InputLabel>
                    <Select
                        labelId="month"
                        id="simple-month"
                        value={month}
                        label="Select Month"
                        onChange={handleMonthChange}
                        color='success'
                    >
                        {
                            monthList.map(month => <MenuItem value={month} key={month}>{month}</MenuItem>)
                        }

                    </Select>
                </FormControl>
                <FormControl sx={{ marginRight: 1, width: '100px' }}>
                    <InputLabel id="Year">Select Year</InputLabel>
                    <Select
                        labelId="year"
                        id="simple-year"
                        value={year}
                        label="Select Year"
                        onChange={handleYearChange}
                        color='success'
                    >
                        {
                            yearList.map(year => <MenuItem value={year} key={year}>{year}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ marginRight: 1,  width: '200px' }}>
                    <TextField
                        required
                        type="number"
                        id="outlined-RefNumber"
                        label="Month's Electricity Bill"
                        sx={{ marginRight: 1, }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">KSH</InputAdornment>
                        }}
                        inputRef={electBillRef}
                        color='success'
                    />
                </FormControl>
                <Button fullWidth color='success'>Get Report</Button>

            </StyledBox>
        </>
    )
}

export default ReportForm