import React from 'react'
import { StyledBox } from './SalesForm'
import BackDrop from '../../BackDrop/BackDrop'
import {CircularProgress as Spinner} from '@mui/material'
function Loading({open }) {
    return (
        <>
            <BackDrop
                open={open}
            />
            <StyledBox
                sx={{ display: open ? 'flex' : 'none', borderRadius: '20px', background:"none" }}
            >
                <Spinner size={60}/>
            </StyledBox>
        </>
    )
}

export default Loading