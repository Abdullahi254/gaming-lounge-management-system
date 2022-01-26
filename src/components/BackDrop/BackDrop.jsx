import React from 'react'
import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')(({ theme }) => ({
    position:'fixed',
    height:'100%',
    width:'100%',
    zIndex:theme.zIndex.drawer +1,
    left:0,
    top:0,
    background:'rgba(0, 0, 0, 0.6)'
}))

function BackDrop({ open, clicked }) {
    return (
        open && <StyledDiv onClick={clicked}></StyledDiv>
    )

}

export default BackDrop
