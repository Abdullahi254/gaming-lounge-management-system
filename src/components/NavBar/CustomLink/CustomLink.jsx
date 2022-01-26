import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

function CustomLink({ children, to, ...props }) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });
    const StyledButton = styled(Button)(({ theme }) => ({
        display: 'flex',
        color: match? 'black': 'inherit',
        margin: 2,
        backgroundColor: match && theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main
          },
    }));
    return (
        <>
            <StyledButton {...props}>
                <Link
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    to={to}
                >
                    {children}
                </Link>
            </StyledButton>

        </>
    )
}

export default CustomLink
