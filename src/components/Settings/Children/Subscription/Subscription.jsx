import React from 'react'
import {StyledContainer} from '../ConsoleSettings/ConsoleSettings';
import SubscriptionCard from './Children/SubscriptionCard';
import UpdateSubscription from './Children/UpdateSubscription';

function Subscription() {
  return (
    <StyledContainer>
        <SubscriptionCard/>
        <UpdateSubscription/>
    </StyledContainer>
  )
}

export default Subscription