import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, AlertTitle, InputAdornment, IconButton, CircularProgress as Spinner } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const { signUp } = useAuth()
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [password1Error, setPass1Error] = React.useState(false)
    const [password2Error, setPass2Error] = React.useState(false)
    const [emailError, setEmailError] = React.useState(false)

    const emailRef = React.useRef()
    const pass1Ref = React.useRef()
    const pass2Ref = React.useRef()

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true)
        setError()
        if (!emailError && !password1Error && !password2Error) {

            signUp(emailRef.current.value, pass1Ref.current.value).then(resp => {
                setLoading(false)
                console.log('signed up successfully')
                setSuccess("Account created successfully")
                navigate("/", { replace: true });
            }).catch(er => {
                setLoading(false)
                setError(`Error signing up! ${er.code}`)
                console.log(er)
            })
        } else {
            setLoading(false)
            emailRef.current.focus()
        }


    };

    const pass1RefCheck = () => {
        if (pass1Ref.current.value.length >= 6) {
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

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (

        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} >
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h6">
                    Sign up.
                </Typography>
                {
                    error &&
                    <Alert severity="error" onClose={() => setError()}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                }
                {
                    success &&
                    <Alert severity="success" onClose={() => setSuccess()}>
                        <AlertTitle>Success</AlertTitle>
                        {success}
                    </Alert>
                }
                {
                    loading && <Spinner />
                }
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="outlined-email"
                        label="Email"
                        type='email'
                        inputRef={emailRef}
                        error={emailError}
                        helperText={emailError && 'Invalid email!'}
                        onChange={emailRefCheck}
                        autoComplete="off"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
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
                        margin="normal"
                        required
                        fullWidth
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
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign up
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/password-reset"
                                style={{ color: 'inherit', fontSize: '14px' }}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/login"
                                style={{ color: 'inherit', fontSize: '14px' }}>
                                Do you have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>

    );
}