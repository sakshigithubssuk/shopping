import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';

const steps=[
  "placed",
  "Order Confirm",
  "Shipped",
  "Out For Delivery",
  "Delivered"
]
const Ordertrack = ({activeStep}) => {
  return <div className='w-full'>
<Stepper activeStep={activeStep} alternativeLabel>
{steps.map((label)=><Step>
  <StepLabel sx={{color:"#9155FD",fontSize:"44px"}}>{label}</StepLabel>
</Step>)}
</Stepper>
  </div>;
}

export default Ordertrack;