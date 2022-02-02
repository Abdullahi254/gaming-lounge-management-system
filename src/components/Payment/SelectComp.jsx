import * as React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem} from '@mui/material'

function SelectComp(props) {

    const handleChange = (event) => {
        props.handleSelectChange(event.target.value)
    };


    return (
        <Box sx={{ minWidth: 120 }} my={2}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={props.type}
                    label="Type"
                    onChange={handleChange}
                    color='success'
                >
                    <MenuItem value={"Mpesa"}>Mpesa</MenuItem>
                    <MenuItem value={"Cash"}>Cash</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}

export default SelectComp;
