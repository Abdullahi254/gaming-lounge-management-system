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
import { Button, Divider, ListItem, ListItemIcon, ListItemText, Switch } from '@mui/material';
import { Receipt, Settings, Logout, DarkMode as AppearanceIcon } from '@mui/icons-material'
import TemporaryDrawer from './TemporaryDrawer/TemporaryDrawer'
import CustomLink from './CustomLink/CustomLink';
import { styled, } from '@mui/material/styles';
import { useNavigate, Outlet } from 'react-router-dom';
import { projectFireStore as db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Notification from './Notification/Notification';
import Nonotification from './Notification/Nonotification';
// import Footer from '../Footer/Footer'

const StyledImg = styled('img')(({ theme }) => ({
    height: theme.spacing(7),
    [theme.breakpoints.down('md')]: {
        height: theme.spacing(5)
    },
    borderRadius: '10px',
    filter: theme.palette.mode === 'light' ? 'invert(100%)' : 'invert(20%)'
}))

const NavBar = ({ email, triggerThemeChange }) => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElNotification, setAnchorNotification] = React.useState(null)
    const [statements, setStatements] = React.useState([])
    const [subs, setSub] = React.useState([])
    const [darkmode, setDarkmode] = React.useState(true)
    const { currentUser, logout } = useAuth();

    // let resolved = useResolvedPath('dashboard');
    // let match = useMatch({ path: resolved.pathname, end: true });
    const navigate = useNavigate()

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenNotificationMenu = (event) => {
        setAnchorNotification(event.currentTarget);
    };


    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const clearSubNotification = async () => {
        try {
            const subRef = await db.collection(`users/${currentUser.uid}/subscriptions`).where('viewed', '==', false).get()
            subRef.forEach((doc) => doc.ref.update({
                viewed: true
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseNotificationMenu = async () => {
        setAnchorNotification(null);
        try {
            const statementRef = await db.collection(`users/${currentUser.uid}/statements`).where('viewed', '==', false).get()
            statementRef.forEach((doc) => doc.ref.update({
                viewed: true
            }))
        } catch (error) {
            console.log(error)
        }
    };


    const settingsButtonHandler = () => {
        navigate('settings')
    }

    const logOutHandler = () => {
        logout().then(res => {
            console.log('log out successfully')
            console.log(res)
        }).catch(er => {
            console.log('failed to logout!')
            console.log(er)
        })
    }

    const receiptButtonHandler = () => {
        navigate('/receipts')
    }

    React.useEffect(() => {
        function fetchSalesNotifications() {
            //fetching notifications from the database using authenticated user's credentials
            const query = db.collection(`users/${currentUser.uid}/statements`).where('viewed', '==', false)
            query.onSnapshot(querySnapshot => {
                setStatements(querySnapshot.docs.map(doc => doc.data()))
            })
        }
        function fetchSubNotifications() {
            //fetching notifications from the database using authenticated user's credentials
            const query = db.collection(`users/${currentUser.uid}/subscriptions`).where('viewed', '==', false)
            query.onSnapshot(querySnapshot => {
                setSub(querySnapshot.docs.map(doc => doc.data()))
            })
        }

        fetchSubNotifications()
        fetchSalesNotifications()

        return () => {
            setStatements([])
            setSub([])
        }
    }, [currentUser])

    const toogleTheme = () => {
        setDarkmode(prev => {
            triggerThemeChange(!prev)
            return !prev
        })
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
                                    onClick={handleOpenNotificationMenu}
                                >
                                    <Badge badgeContent={(statements.length + subs.length)} color="error" >
                                        <NotificationsIcon
                                            sx={{
                                                fontSize: { xs: '24px', sm: '26px', md: '28px' },
                                                color: (theme) => theme.palette.text
                                            }}
                                        />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px', maxHeight: 400 }}
                                id="menu-appbar0"
                                anchorEl={anchorElNotification}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElNotification)}
                                onClose={handleCloseNotificationMenu}
                            >
                                {
                                    statements.length > 0 &&
                                    statements.map((item, index) => {
                                        return (
                                            <Notification
                                                sale={true}
                                                key={index}
                                                amount={item.amount}
                                                name={item.from}
                                                date={item.date.toDate().toString().split(' G')[0]}
                                            />
                                        )
                                    })
                                }
                                {
                                    subs.length > 0 &&
                                    subs.map((item, index) => {
                                        return (
                                            <Notification
                                                sub={true}
                                                key={index}
                                                amount={item.amount}
                                                date={item.date.toDate().toString().split(' G')[0]}
                                            />
                                        )
                                    })
                                }

                                {
                                    (statements.length <= 0) && (subs.length <= 0) && <Nonotification />
                                }
                                {
                                    subs.length > 0 &&
                                    <Box sx={{textAlign:'center'}}>
                                        <Button size='small' onClick={clearSubNotification} color='success'>
                                            clear
                                        </Button>
                                    </Box>
                                }
                            </Menu>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1 }} >
                                    <Avatar
                                        sx={{
                                            width: { xs: '30px', sm: '40px' }, height: { xs: '30px', sm: '40px' },
                                        }}
                                        src={currentUser.photoURL}
                                    >
                                        <Typography
                                            sx={{
                                                color: (theme) => theme.palette.mode === "dark" ? "white" : "black"
                                            }}
                                        >
                                            {
                                                currentUser.displayName ?
                                                    currentUser.displayName[0].toUpperCase() :
                                                    email[0].toUpperCase()
                                            }
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
                                <ListItem button onClick={settingsButtonHandler}>
                                    <ListItemIcon>
                                        <Settings />
                                    </ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </ListItem>
                                <ListItem button onClick={receiptButtonHandler}>
                                    <ListItemIcon>
                                        <Receipt />
                                    </ListItemIcon>
                                    <ListItemText primary="Receipts" />
                                </ListItem>
                                <ListItem button >
                                    <ListItemIcon>
                                        <AppearanceIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Appearance" />
                                    <Switch
                                        checked={darkmode}
                                        onChange={toogleTheme}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem button onClick={logOutHandler}>
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
            {/* {!match && <Footer />} */}
        </>
    );
};
export default NavBar;

