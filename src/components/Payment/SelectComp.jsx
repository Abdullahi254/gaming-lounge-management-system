import * as React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

function SelectComp(props) {

    const handleChange = (event) => {
        props.handleSelectChange(event.target.value)
    };


    return (
        <Box sx={{ minWidth: 120 }} my={2}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Payment Options</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={props.type}
                    label="Payment Options"
                    onChange={handleChange}
                    color='success'
                >
                    <MenuItem value={props.type1}>{props.type1}</MenuItem>
                    <MenuItem value={props.type2}>{props.type2}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}

export default SelectComp;
