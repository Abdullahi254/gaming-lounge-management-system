import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, AlertTitle, InputAdornment, IconButton, CircularProgress as Spinner} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
export default function SignIn() {
    const [error, setError] = useState('')
    const { currentUser, login } = useAuth()
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    // const location = useLocation()
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true)
        // const from = location.state.from.pathname || "/"
        const from = "/"
        const data = new FormData(event.currentTarget);
        login(data.get('email'), data.get('password')).then(resp => {
            console.log('logged in successfully')
            setLoading(false)
            axios({
                method: 'post',
                url: "https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/api/membership/check-membership",
                data: {
                    email: resp.user.email,
                }
            }).then(res => {
                console.log(res.data)
                resp.user.getIdToken(true)
            }).catch(er => {
                console.log(er)
            })
            navigate(from, { replace: true });
        }).catch(er => {
            setError("Error logging in! Check email or password.")
            setLoading(false)
        })
    };

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
                {
                    currentUser ?
                        <Avatar
                            sx={{
                                width: { xs: '30px', sm: '40px' },
                                height: { xs: '30px', sm: '40px' },
                                background:(theme)=>theme.palette.background.paper
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
                                                    currentUser.email[0].toUpperCase()
                                            }
                            </Typography>
                        </Avatar> :
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} >
                            <LockOutlinedIcon />
                        </Avatar>
                }

                <Typography component="h1" variant="h6">
                    {currentUser ? "Already logged in." : "Sign in"}
                </Typography>

                {
                    currentUser &&
                    <Link to="/dashboard"
                        style={{ color: 'inherit', fontSize: '14px' }}>
                        Go to dashboard.
                    </Link>
                }

                <Typography component="h1" variant="h6" gutterBottom>
                    {currentUser && "Sign in with another account?"}
                </Typography>
                {
                    error &&
                    <Alert severity="error" onClose={() => setError('')}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                }
                {
                    loading && <Spinner/>
                }
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'string' : 'password'}
                        id="password"
                        autoComplete="current-password"
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
                    <FormControlLabel
                        control={<Checkbox value="remember" color="secondary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/password-reset"
                                style={{ color: 'inherit', fontSize: '14px' }}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/signup"
                                style={{ color: 'inherit', fontSize: '14px' }}>
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>

    );
}