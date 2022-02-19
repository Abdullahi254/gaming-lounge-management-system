import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material'
import { styled } from '@mui/material/styles';
import { AccountBox as AccountBoxIcon, Gamepad, Unsubscribe as SubscribeIcon } from '@mui/icons-material'
import { Outlet, useResolvedPath, useMatch, useNavigate } from 'react-router-dom'

const SideNav = styled(List)(({ theme }) => ({
    display: 'flex',
    flexWrap:'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '30%',
    marginTop: '.049rem',
    [theme.breakpoints.down('md')]: {
        width: '100%',

    }
}))

function Item({ children, to, ...props }) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

    const Item = styled(ListItem)(({ theme }) => ({
        width: '100%',
        color: match? 'black': 'inherit',
        margin: '50px 0',
        backgroundColor: match && (theme.palette.mode ==="dark" ? theme.palette.primary.dark : theme.palette.primary.main),
        "&:hover": {
            backgroundColor: theme.palette.primary.main
        },
        [theme.breakpoints.down('md')]: {
            margin:'20px 0'
        }
    }))
    return (
        <Item {...props}>{children}</Item>
    )
}

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent:'space-around',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    }
}))

function Settings() {
    let navigate = useNavigate()
    return (
        <StyledBox>
            <SideNav>
                <Item button to="my-account" onClick={() => navigate("my-account")}>
                    <ListItemIcon>
                        <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Account"} />
                </Item>
                <Item button to="console-settings" onClick={() => navigate("console-settings")}>
                    <ListItemIcon>
                        <Gamepad />
                    </ListItemIcon>
                    <ListItemText primary={"Console Settings"} />
                </Item>
                <Item button to="my-subscription" onClick={() => navigate("my-subscription")}>
                    <ListItemIcon>
                        <SubscribeIcon />
                    </ListItemIcon>
                    <ListItemText primary={"My Subscription"} />
                </Item>
            </SideNav>
            <Outlet />
        </StyledBox>
    )
}
export default Settings;
