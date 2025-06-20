import React from 'react';
import AdressCardpage from '../AddressCard/AdressCardpage';
import Ordertrack from './Ordertrack';
import { Box, Grid } from '@mui/material';
import front4 from '../../../assets/front4.jpeg';

import { deepPurple } from '@mui/material/colors';
import StarOutlineIcon from '@mui/icons-material/StarOutline';


const OrderDetails = ({activeStep}) => {
  return (
    <div className='px-5 lg:px-20'>

      <div>
        <h1 className='font-bold text-xl py-7 '>Delivery Address</h1>
        <div className='border'>
        <AdressCardpage/>
        </div>
        </div>


      <div className='py-10'>
        <Ordertrack activeStep={activeStep}></Ordertrack>
      </div>

      <Grid container spacing={3}>
        {[1,1,1,1,1].map((item)=> <Grid item xs={12} className='w-full'>
          <div className='shadow-xl rounded-md p-5 border'>
             {/* The parent Grid container uses flexbox */}
             <Grid container spacing={2} alignItems="center">
                {/* Image Item */}
                <Grid item xs={3} sm={2} md={1.5}>
                  <img className='w-[5rem] h-[5rem] sm:w-[6rem] sm:h-[6rem] object-cover object-top rounded' src={front4} alt="Product"/>
                </Grid>
                 {/* Details Item */}
                <Grid item xs={9} sm={7} md={8}> {/* Adjusted sm/md width slightly */}
                  <div className='space-y-1'>
                    <p className='font-semibold'>Men's Accessories</p>
                    <div className='flex space-x-5 text-xs text-gray-800 opacity-50'>
                      <span>Color: Black</span>
                      <span>Size: M</span>
                    </div>
                    <p className='text-sm text-gray-600'>Seller: Levi's</p>
                  </div>
                </Grid>
                 {/* Rate and Review Item - Add sx prop here */}
                <Grid
                  item
                  xs={12} // Stack below on extra-small screens
                  sm={'auto'} // Take content width on small screens and up
                  sx={{
                      marginTop: { xs: 2, sm: 0 }, // Add margin when stacked
                      marginLeft: { sm: 'auto' }   // Apply auto margin to push right on sm+ screens
                  }}
                >
                  {/* Removed right:'0' from Box, added display flex for alignment */}
                  <Box sx={{ color:deepPurple[500], display: 'flex', alignItems: 'center', gap: 0.5, cursor:'pointer' }}>
                    <StarOutlineIcon sx={{ fontSize: '1.2rem' }} /> {/* Adjusted icon size slightly */}
                    <span>Rate and Review Product</span>
                  </Box>
                </Grid>
             </Grid>
          </div>
        </Grid>)}
       
      </Grid>

    </div>
  );
}

export default OrderDetails;