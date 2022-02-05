import React from 'react';
import {StyledContainer} from '../Dashboard/Dashbord'
import Dp from './children/Dp';
import EmailPasswordCard from './children/EmailPasswordCard';

function Account() {
  return (
      <StyledContainer sx={{flexDirection:'column'}}>
          <Dp/>
          <EmailPasswordCard/>
      </StyledContainer>
  )
}

export default Account;
