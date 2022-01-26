import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import logo from '../../assets/imgs/logo.png'
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { Divider, ListItem, ListItemIcon, ListItemText, Switch } from '@mui/material';
import { AccountBox, Settings, Logout, DarkMode as AppearanceIcon } from '@mui/icons-material'
import TemporaryDrawer from './TemporaryDrawer/TemporaryDrawer'
import CustomLink from './CustomLink/CustomLink';
import { styled, } from '@mui/material/styles';
import { useNavigate, Outlet } from 'react-router-dom';
const StyledImg = styled('img')(({ theme }) => ({
    height: theme.spacing(7),
    [theme.breakpoints.down('md')]: {
        height: theme.spacing(5)
    },
    borderRadius: '10px'
}))


const NavBar = ({ email, checked, toogleTheme }) => {

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate()

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };



    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const settingsButtonHandler = () => {
        navigate('settings')
    }

    return (
        <>
            <AppBar position="static" sx={{ background: (theme) => theme.palette.background.paper }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex', flexGrow: 1 } }}
                        >
                            <StyledImg src={logo} alt="logo" />
                        </Typography>
                        <TemporaryDrawer />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                        >

                            <StyledImg src={logo} alt="logo" />


                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <CustomLink to="dashboard" sx={{ padding: '15px' }}>
                                Dashboard
                            </CustomLink>
                            <CustomLink to="activeconsoles" >
                                Active Consoles
                            </CustomLink>
                            <CustomLink to="idleconsoles" >
                                Idle Consoles
                            </CustomLink>
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Notifications">
                                <IconButton
                                    aria-label="show 17 new notifications"
                                    size='small'
                                >
                                    <Badge badgeContent={17} color="error" >
                                        <NotificationsIcon
                                            sx={{
                                                fontSize: { xs: '24px', sm: '26px', md: '28px' },
                                                color: (theme) => theme.palette.text
                                            }}
                                        />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1 }} >
                                    <Avatar
                                        sx={{
                                            width: { xs: '30px', sm: '40px' }, height: { xs: '30px', sm: '40px' },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: (theme) => theme.palette.mode === "dark" ? "white" : "black"
                                            }}
                                        >
                                            {email[0].toUpperCase()}
                                        </Typography>
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <ListItem button >
                                    <ListItemIcon>
                                        <AccountBox />
                                    </ListItemIcon>
                                    <ListItemText primary="Account" />
                                </ListItem>
                                <ListItem button onClick={settingsButtonHandler}>
                                    <ListItemIcon>
                                        <Settings />
                                    </ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </ListItem>
                                <ListItem button >
                                    <ListItemIcon>
                                        <AppearanceIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Appearance" />
                                    <Switch checked={checked} onChange={toogleTheme} />
                                </ListItem>
                                <Divider />
                                <ListItem button >
                                    <ListItemIcon>
                                        <Logout />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Outlet />
        </>
    );
};
export default NavBar;

