import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

// function Copyright() {
//     return (
//         <Typography variant="body2" color="text.secondary">
//             {'Copyright © '}
//             <Link color="inherit" href="/">
//                 Aim Labs KE
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

const SocialsContainer = styled((props) => {
    return <Box {...props} />;
})(({ theme }) => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom:5
}));

const StyledLink = styled('a')(() => ({
    textDecoration: 'none',
    color: 'inherit',
}))

const StyledBox = styled(Box)(({ theme }) => ({
    padding: `${theme.spacing(2)} 0`,
    display: 'flex',
    [theme.breakpoints.down('xl')]: {
        display: 'none'
    },
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    background: theme.palette.background.paper
}))

export default function Footer() {
    return (

        <StyledBox component="footer">
            <Typography
                variant="body1"
                gutterBottom
            >
                AIM LABS KE.
            </Typography>
            <SocialsContainer>
                <span style={{margin:'2px 5px'}}>
                    <StyledLink href="https://linkedin.com/in/abdullahi-mohamud-aa04291b6" target="_blank">
                        <LinkedInIcon color='info' />
                    </StyledLink>
                </span>
                <span style={{margin:'2px 5px'}}>
                    <StyledLink href="https://github.com/Abdullahi254" target="_blank">
                        <GitHubIcon />
                    </StyledLink>
                </span>
            </SocialsContainer>
            <Typography variant='subtitle2' sx={{color:(theme)=>theme.palette.text.secondary}}>
                <StyledLink href="https://linkedin.com/in/abdullahi-mohamud-aa04291b6" target="_blank">
                    @Abdullah
                </StyledLink>
            </Typography>
            {/* <Copyright /> */}
        </StyledBox>

    );
}