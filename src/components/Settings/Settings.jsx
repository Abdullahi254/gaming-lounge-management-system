import React from 'react';
import ConsoleList from './Children/ConsoleList';
import { StyledContainer } from '../Dashboard/Dashbord';
import AddConsoleForm from './Children/AddConsoleForm';

function Settings() {
    return (
        <StyledContainer>
            <ConsoleList/>
            <AddConsoleForm/>
        </StyledContainer>
    )
}
export default Settings;
