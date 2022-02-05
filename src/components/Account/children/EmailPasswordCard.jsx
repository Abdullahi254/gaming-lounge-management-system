import React from 'react';
import { Box, Button, Collapse, TextField, Typography, IconButton, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../../contexts/AuthContext';

const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    borderRadius: '20px',
    flexWrap: 'wrap',
    width: '450px',
    [theme.breakpoints.down('sm')]: {
        width: 'auto'
    },
    boxShadow: 'rgb(0, 0, 0) 0px 20px 30px -10px'
}))

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


function EmailPasswordCard() {
    const [expanded, setExpanded] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false)
    const { currentUser, updateEmail, passwordResetByMail } = useAuth()

    const handleEmailUpdate = (e) => {
        e.preventDefault()
        updateEmail(e.target.value).then(res => {
            console.log('updated successfully')
        }).catch(er => {
            console.log('error updating...', er)
        })
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    console.log(currentUser)
    return (
        <StyledBox>
            <Typography variant='h6' gutterBottom sx={{ textDecoration: 'underline' }}>Email address.</Typography>
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>{currentUser.email}</Typography>
            <Typography variant='caption' gutterBottom sx={{ marginBottom: '15px' }}>Primary.</Typography>
            <Typography variant='subtitle2' gutterBottom sx={{ marginBottom: '15px' }}>
                To update your email, you might need to login again with your current credentials.
            </Typography>

            <Typography variant='h6' gutterBottom sx={{ textDecoration: 'underline' }}>Password.</Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>******</Typography>
            <Typography sx={{ color: 'gray', cursor: 'not-allowed' }}>
                <VisibilityIcon />
            </Typography>
            <Typography variant='subtitle2' gutterBottom sx={{ marginBottom: '15px' }}>
                To update your password, you might need to login again with your current credentials.
            </Typography>

            <Typography component='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    size='small'
                >
                    {!expanded && 'Change'}
                    <ExpandMoreIcon />
                </ExpandMore>
            </Typography>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                    onSubmit={handleEmailUpdate}
                    component='form'
                    sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        marginBottom: '40px'
                    }}>
                    <TextField
                        sx={{
                            marginBottom: '10px'
                        }}
                        required
                        id="outlined-email"
                        label="New Email"
                        defaultValue={currentUser.email}
                        type='email'
                    />
                    <Button
                        size='small'
                        type='submit'
                        color='success'
                    >
                        Update Email
                    </Button>
                </Box>

                <Box
                    component='form'
                    sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                    }}
                >
                    <TextField
                        sx={{
                            marginBottom: '10px'
                        }}
                        required
                        id="outlined-password"
                        label="New Password"
                        type={showPassword ? 'string' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <TextField
                        sx={{
                            marginBottom: '10px'
                        }}
                        required
                        id="outlined-password2"
                        label="Confirm Password"
                        type={showPassword ? 'string' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        size='small'
                        type='submit'
                        color='success'
                    >
                        Update Password
                    </Button>
                </Box>

            </Collapse>
        </StyledBox>
    )
}

export default EmailPasswordCard;
