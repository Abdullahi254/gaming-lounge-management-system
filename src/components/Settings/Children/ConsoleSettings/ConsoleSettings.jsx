import React from 'react'
import ConsoleList from './Children/ConsoleList';
import AddConsoleForm from './Children/AddConsoleForm';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material'

export const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width:'70%',
    [theme.breakpoints.down('md')]: {
        width: '100%',

    },
    [theme.breakpoints.only('xl')]: {
        width: '60%',

    },
}))

function ConsoleSettings() {
    return (
        <StyledContainer >
            <ConsoleList />
            <AddConsoleForm />
        </StyledContainer>
    )
}

export default ConsoleSettings