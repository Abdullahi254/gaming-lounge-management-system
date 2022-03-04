import React from 'react';
import { Paper} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaleNotification from './SaleNotification';
import SubscriptionNotification from './SubscriptionNotification';

export const StyledPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 2
}))

function Notification({ sub, sale, name,amount,date }) {
    return (
        <StyledPaper  variant="outlined">
            {
                sale &&
                <SaleNotification
                    name={name}
                    amount={amount}
                    date={date}
                />
            }

            {
                sub && <SubscriptionNotification
                    amount={amount}
                    date={date}
                />
            }
        </StyledPaper>
    )
}

export default Notification;
