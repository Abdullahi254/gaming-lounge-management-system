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
import { Alert, AlertTitle } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function SignIn() {
    const [error, setError] = useState('')
    const { currentUser, login } = useAuth()

    // const location = useLocation()
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        // const from = location.state.from.pathname || "/"
        const from = "/"
        const data = new FormData(event.currentTarget);
        login(data.get('email'), data.get('password')).then(res => {
            console.log('logged in successfully')
            navigate(from, { replace: true });
        }).catch(er => {
            setError("Error logging in! Check email or password.")
        })
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
                        >
                            <Typography
                                sx={{
                                    color: (theme) => theme.palette.mode === "dark" ? "white" : "black"
                                }}
                            >
                                {currentUser.email[0].toUpperCase()}
                            </Typography>
                        </Avatar> :
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
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
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
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