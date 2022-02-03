import React from 'react';
import { Typography, Button } from '@mui/material';
import { StyledContainer } from '../Dashboard/Dashbord'
import logo from '../../assets/imgs/404.png'
import { styled } from '@mui/material/styles';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {useNavigate} from 'react-router-dom'
export const StyledImg = styled('img')(({ theme }) => ({
  maxHeight: '400px',
  minWidth: '200px',
  maxWidth: '100%',
  margin: 'auto',
  paddingLeft: '60px',
  marginBottom: '10px'
}))

function NotFound() {
  const navigate = useNavigate()
  const goHome = ()=>{
    navigate("/")
  }
  return (
    <StyledContainer sx={{ flexDirection: 'column' }}>
      <StyledImg
        src={logo}
        alt="404"
        style={{}}
      />
      <Typography variant='h4' align='center' gutterBottom>Something's missing.</Typography>
      <Typography variant='h6' align='center' gutterBottom sx={{marginBottom:7}}>
        This page is missing or you assembled the link incorrectly.
      </Typography>
      <Button
        startIcon={<KeyboardBackspaceIcon />}
        size='large'
        sx={{ color: (theme) => theme.palette.mode ==='light'?'black':'white'}}
        variant='outlined'
        onClick={goHome}
        >
        Go Home
      </Button>
    </StyledContainer>
  )
}

export default NotFound;
