import React from 'react'
import { Typography} from '@mui/material';

function SubscriptionNotification({amount, date}) {
  return (
   <>
    <>
            Confirmed&nbsp;<Typography sx={{ color: '#d32f2f' }}>KSH{amount.toFixed(2)}</Typography>
            &nbsp;payed to upgrade subscription on &nbsp;<Typography sx={{ color: '#d32f2f' }}>{date}.</Typography>
        </>
   </>
  )
}

export default SubscriptionNotification