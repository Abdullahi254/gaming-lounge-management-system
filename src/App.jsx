import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, } from '@mui/material/colors';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from "./components/NavBar/NavBar";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ActiveConsoles from './components/ActiveConsoles/ActiveConsoles';
import { useAuth } from './contexts/AuthContext';
import SignIn from './components/SignIn/SignIn';
import { CssBaseline } from '@mui/material';
import IdleConsoles from './components/IdleConsoles/IdleConsoles';
import Dashbord from './components/Dashboard/Dashbord';
import Settings from './components/Settings/Settings';
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      ...grey,
      ...(mode === 'dark' && {
        main: grey[300],
      }),
    },
    secondary: {
      main: '#f50057',
    },
    ...(mode === 'dark' ? {
      background: {
        default: grey[900],
        paper: grey[800],
      },
    } : {
      background: {
        default: grey[400],
        paper: grey[300],
      },
    }
    ),
    text: {
      ...(mode === 'light'
        ? {
          primary: grey[900],
          secondary: grey[800],
        }
        : {
          primary: '#fff',
          secondary: grey[500],
        }),
    },
  },
});




function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation()
  return currentUser ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
  const [themeMode, setThemeMode] = useState(true)
  const { currentUser } = useAuth();
  const darkModeTheme = createTheme(getDesignTokens(themeMode ? 'dark' : 'light'));
  const handleTheme = () => {
    setThemeMode(prev => !prev)
  }
  return (
    <ThemeProvider theme={darkModeTheme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/"
            element={currentUser ?
              <NavBar email={currentUser.email} checked={themeMode} toogleTheme={handleTheme} /> :
              <Navigate to="/login" />
            }>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="activeconsoles" element={<PrivateRoute><ActiveConsoles /></PrivateRoute>} />
            <Route path="idleconsoles" element={<PrivateRoute><IdleConsoles /></PrivateRoute>} />
            <Route path="dashboard" element={<PrivateRoute><Dashbord /></PrivateRoute>} />
            <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
