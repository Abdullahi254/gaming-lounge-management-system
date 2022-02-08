import React from 'react';
import {
    Box,
    Button,
    Collapse,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Alert,
    CircularProgress as Spinner
} from '@mui/material'

import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../../contexts/AuthContext';
import Login from './Login';

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
    const [showLogin, setShowLogin] = React.useState(false)
    const [success, setSuccess] = React.useState()
    const [error, setError] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [password1Error, setPass1Error] = React.useState(false)
    const [password2Error, setPass2Error] = React.useState(false)
    const [emailError, setEmailError] = React.useState(false)
    const emailRef = React.useRef()
    const pass1Ref = React.useRef()
    const pass2Ref = React.useRef()
    const { currentUser, updateUserEmail, updateUserPassword } = useAuth()

    const handleEmailUpdate = (e) => {
        e.preventDefault()
        setSuccess()
        setError()
        if (!emailError) {
            setLoading(true)
            updateUserEmail(emailRef.current.value).then(res => {
                setLoading(false)
                console.log('successfull')
                setSuccess('successfully updated email!')
            }).catch(er => {
                setLoading(false)
                console.log(er.code)
                if (er.code === 'auth/requires-recent-login') {
                    console.log('prompting user for credentials....')
                    setShowLogin(true)
                } else {
                    setError('Error! Enter correct input or contact admin.')
                }
            })
        }else {
            emailRef.current.focus()
        }

    }

    const passwordUpdateHandler = (e) => {
        e.preventDefault()
        setSuccess()
        setError()
        if (!password1Error && !password2Error) {
            setLoading(true)
            updateUserPassword(pass1Ref.current.value).then(() => {
                setLoading(false)
                console.log('successfully updated password')
                setSuccess('successfully updated password')
            }).catch(er => {
                setLoading(false)
                console.log(er.code)
                if (er.code === 'auth/requires-recent-login') {
                    console.log('prompting user for credentials....')
                    setShowLogin(true)
                } else {
                    setError('Error! Enter correct input or contact admin.')
                }
            })
        }
        if (password1Error) {
            pass1Ref.current.focus()
        } else {
            pass2Ref.current.focus()
        }

    }

    const pass1RefCheck = () => {
        if (pass1Ref.current.value.length >= 10) {
            setPass1Error(false)
        }
        else {
            setPass1Error(true)
        }
    }

    const pass2RefCheck = () => {
        if (pass2Ref.current.value !== pass1Ref.current.value) {
            setPass2Error(true)
        }
        else {
            setPass2Error(false)
        }
    }
    const emailRefCheck = () => {
        if (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            .test(emailRef.current.value)) {
            setEmailError(false)
        } else {
            setEmailError(true)
        }
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

    const closeAlertHandler = () => {
        setSuccess()
        setError()
    }

    const closeSpinnerBackdropHandler = () => {
        setLoading(false)
        setShowLogin(false)
    }

    return (
        <StyledBox>
            {success && <Alert severity="success" sx={{ justifyContent: 'center' }} onClose={closeAlertHandler}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ justifyContent: 'center' }} onClose={closeAlertHandler}>{error}</Alert>}
            {loading && <Spinner
                color='inherit'
                size={80}
                sx={{
                    position: 'fixed',
                    left: '43%',
                    top: '30%',
                    transform: 'translateX(50%)',
                    zIndex: 300
                }}
            />}
            <Login
                spinner={loading}
                show={showLogin}
                clicked={closeSpinnerBackdropHandler}
                showPassword={showPassword}
                handleClickShowPassword={handleClickShowPassword}
                handleMouseDownPassword={handleMouseDownPassword}
            />
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
                        inputRef={emailRef}
                        error={emailError}
                        helperText={emailError && 'Invalid email!'}
                        onChange={emailRefCheck}
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
                    onSubmit={passwordUpdateHandler}
                >
                    <TextField
                        sx={{
                            marginBottom: '10px'
                        }}
                        required
                        id="outlined-password"
                        label="New Password"
                        type={showPassword ? 'string' : 'password'}
                        error={password1Error}
                        helperText={password1Error && 'must be atleast 6 digits!'}
                        onChange={pass1RefCheck}
                        inputRef={pass1Ref}
                        autoComplete='off'
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
                        error={password2Error}
                        helperText={password2Error && 'passwords not matching!'}
                        onChange={pass2RefCheck}
                        inputRef={pass2Ref}
                        autoComplete='off'
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
