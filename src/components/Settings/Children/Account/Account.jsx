import React from 'react';
import { StyledContainer } from '../ConsoleSettings/ConsoleSettings'
import Dp from './children/Dp';
import EmailPasswordCard from './children/EmailPasswordCard';

function Account() {
  return (
    <StyledContainer>
      <Dp />
      <EmailPasswordCard />
    </StyledContainer>
  )
}

export default Account;
