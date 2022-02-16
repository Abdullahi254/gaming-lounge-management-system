import React from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import ReportCard from './Children/ReportCard';
import SalesChart from './Children/SalesChart';
import SalesCard from './Children/SalesCard';
import StatementTable from './Children/StatementTable';
import AddIcon from '@mui/icons-material/Add';
import { Tooltip, IconButton } from '@mui/material';
import SalesForm from './Children/SalesForm';
import VerificationCard from './Children/VerificationCard';

export const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 'auto',
    maxWidth: '1200px',
}))

function Dashbord() {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <StyledContainer >
            <VerificationCard />
            <ReportCard />
            <SalesChart />
            <SalesCard />
            <StatementTable />
            <Tooltip title="Create Sale">
                <IconButton size='large'
                    sx={{ background: (theme) => theme.palette.background.paper }}
                    onClick={handleToggle}
                >
                    <AddIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <SalesForm open={open} handleClose={handleClose} />
        </StyledContainer>
    )
}

export default Dashbord
