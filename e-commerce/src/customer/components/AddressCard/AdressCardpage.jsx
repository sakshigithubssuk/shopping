import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function AdressCardpage({ address, onSelect }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        p: 2,
        minWidth: 250,
        position: 'relative',
      }}
    >
      <Typography variant="h6">
        {address.firstName} {address.lastName}
      </Typography>
      <Typography>{address.streetAddress}</Typography>
      <Typography>
        {address.city}, {address.state} {address.zipCode}
      </Typography>
      <Typography>Phone: {address.mobile}</Typography>

      
    </Box>
  );
}
