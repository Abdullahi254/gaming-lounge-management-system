import React from 'react'
import { Typography} from '@mui/material';

function SubscriptionNotification({amount, date}) {
  return (
   <>
    <>
            Confirmed&nbsp;<Typography sx={{ color: '#d32f2f', cursor:'pointer' }}>KSH{amount.toFixed(2)}</Typography>
            &nbsp;paid to upgrade subscription on &nbsp;<Typography sx={{ color: '#d32f2f' }}>{date}.</Typography>
        </>
   </>
  )
}

export default SubscriptionNotification