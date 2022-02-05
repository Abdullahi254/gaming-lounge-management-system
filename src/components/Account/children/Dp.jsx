import React from 'react';
import { Box, Card, CardMedia, CardActions, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import testDp from '../../../assets/imgs/Alesso_profile.png'

const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    margin: 10,
    borderRadius: '20px',
    flexWrap:'wrap',
    alignItems:'center',
    justifyContent:'center',
    boxShadow:'rgb(0, 0, 0) 0px 20px 30px -10px'
}))

function ImgMediaCard() {
    return (
        <Card sx={{ maxWidth: 200, borderRadius: '30px', margin:'10px'}}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={testDp}
            />
            <CardActions>
                <Button
                    size="small"
                    sx={{ color: (theme) => theme.palette.mode === 'light' && 'black' }}
                >
                    Update Photo
                </Button>
            </CardActions>
        </Card>
    );
}

function Dp() {
    return (
        <StyledBox>
            <ImgMediaCard />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection:'column',
                    alignItems:'center',
                    width:'250px'
                }}
            >
                <Typography variant='h6' gutterBottom>John Doe</Typography>
                <Button
                    size="small"
                    sx={{ color: (theme) => theme.palette.mode === 'light' && 'black' }}
                    variant='outlined'
                >
                    Change name
                </Button>
            </Box>
        </StyledBox>
    )
}

export default Dp;
