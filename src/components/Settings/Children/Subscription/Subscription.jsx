import React from 'react'
import {StyledContainer} from '../ConsoleSettings/ConsoleSettings';
import SubscriptionCard from './Children/SubscriptionCard';
import UpdateSubscription from './Children/UpdateSubscription';
import SelectComp from '../../../Payment/SelectComp';
function Subscription() {
  const [transType, setTransType] = React.useState("PAYBILL")
  return (
    <StyledContainer>
        <SubscriptionCard/>
        <SelectComp
          type={transType}
          type1="PAYBILL"
          type2="STP"
          handleSelectChange = {(type)=>setTransType(type)}
        />
        <UpdateSubscription type={transType}/>
    </StyledContainer>
  )
}

export default Subscription