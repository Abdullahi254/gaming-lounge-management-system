import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, } from '@mui/material/colors';
import NavBar from "./components/NavBar/NavBar";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ActiveConsoles from './components/ActiveConsoles/ActiveConsoles';
import { useAuth } from './contexts/AuthContext';
import SignIn from './components/SignIn/SignIn';
import { CssBaseline } from '@mui/material';
import IdleConsoles from './components/IdleConsoles/IdleConsoles';
import Dashbord from './components/Dashboard/Dashbord';
import Layout from './components/Settings/Layout';
import Payment from './components/Payment/Payment';
import AmountStatus from './components/AmountStatus/AmountStatus';
import NotFound from './components/404/NotFound';
import Account from './components/Account/Account';
import GetEmailCard from './components/SignIn/children/GetEmailCard';
import ConsoleSettings from './components/Settings/Children/ConsoleSettings/ConsoleSettings';
import Subscription from './components/Subscription/Subscription';

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
          secondary: grey[700],
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
  const [darkmode, setDarkmode] = useState(false)
  const { currentUser } = useAuth();
  const darkModeTheme = createTheme(getDesignTokens(darkmode ? 'dark' : 'light'));
  return (
    <ThemeProvider theme={darkModeTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/"
          element={currentUser ?
            <NavBar email={currentUser.email} isDarkMode={(mode) => setDarkmode(mode)} /> :
            <Navigate to="/login" />
          }>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="activeconsoles" element={<PrivateRoute><ActiveConsoles /></PrivateRoute>} />
          <Route path="activeconsoles/payment/:time/:price" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="idleconsoles" element={<PrivateRoute><IdleConsoles /></PrivateRoute>} />
          <Route path="dashboard" element={<PrivateRoute><Dashbord /></PrivateRoute>} />
          <Route path="settings" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="my-account" index element={<PrivateRoute><Account /></PrivateRoute>} />
            <Route path="console-settings" element={<PrivateRoute><ConsoleSettings /></PrivateRoute>} />
            <Route path="my-subscription" element={<PrivateRoute> <Subscription /></PrivateRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/view-amount/:time/:price" element={<AmountStatus />} />
        <Route path="/password-reset" element={<GetEmailCard />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
