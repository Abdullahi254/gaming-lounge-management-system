import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CustomLink from '../CustomLink/CustomLink';
export default function TemporaryDrawer() {
    const [anchor, setAnchor] = useState(false)

    const toggleDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setAnchor(true)
    };

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setAnchor(false)}
            onKeyDown={() => setAnchor(false)}
        >
            <List sx={{ margin: '2px 0', width: '100%' }}>
                <CustomLink to="dashboard" startIcon={<DashboardIcon />} size='large' sx={{ width: '100%' }}>
                    Dashboard
                </CustomLink>
            </List>
            <Divider />
            <List sx={{ margin: '20px 0', marginBottom: 5, width: '100%' }}>
                <CustomLink to="activeconsoles" startIcon={<ToggleOnIcon />} size='large' sx={{ width: '100%' }}>
                    Active Console
                </CustomLink>
            </List>
            <List sx={{ width: '100%' }}>
                <CustomLink to="idleconsoles" startIcon={<ToggleOffIcon />} size='large' sx={{ width: '100%' }}>
                    Idle----- Console
                </CustomLink>
            </List>
        </Box >
    );

    return (
        <>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={toggleDrawer}
                    color="inherit"
                >
                    <MenuIcon />
                </IconButton>
            </Box>
            <Drawer
                anchor="left"
                open={anchor}
                onClose={() => setAnchor(false)}
            >
                {list()}
            </Drawer>
        </>
    );
}
