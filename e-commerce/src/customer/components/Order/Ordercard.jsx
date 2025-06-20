import React from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel'; // Icon for cancelled
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'; // Icon for returned
// Assuming front4 is imported correctly or replace with a prop
import front4 from '../../../assets/front4.jpeg'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const Ordercard = ({
    imageUrl = front4,
    title = "Men's Premium Softshell Jacket", // Example longer title
    size = "M",
    color = "Charcoal Black", // Example longer color
    price = 1099,
    status = 'delivered', // 'delivered', 'on_the_way', 'cancelled', 'returned'
    deliveryDate = "March 03, 2024",
    expectedDate = "March 10, 2024",
    orderNumber = "701-1234567-1234567" // Example extra detail
}) => {
const navigate=useNavigate();
    const formatPrice = (num) => {
        return `$${num.toFixed(2)}`;
    }

    const renderStatus = () => {
        switch (status) {
            case 'delivered':
                return (
                    <Box display="flex" alignItems="center" sx={{ color: 'success.main', flexWrap: 'wrap' }}> {/* Allow wrap */}
                        <CheckCircleIcon sx={{ mr: 0.5, fontSize: '1.1rem', flexShrink: 0 }} />
                        <Typography variant="body2" component="span" fontWeight="medium"> {/* Use body2 for consistency */}
                            Delivered on {deliveryDate}
                        </Typography>
                    </Box>
                );
            case 'on_the_way':
                 return (
                    <Box display="flex" alignItems="center" sx={{ color: 'info.main', flexWrap: 'wrap' }}>
                        <LocalShippingIcon sx={{ mr: 0.5, fontSize: '1.1rem', flexShrink: 0 }} />
                        <Typography variant="body2" component="span" fontWeight="medium">
                            Expected by {expectedDate}
                        </Typography>
                    </Box>
                );
            case 'cancelled':
                 return (
                     <Box display="flex" alignItems="center" sx={{ color: 'error.main', flexWrap: 'wrap' }}>
                        <CancelIcon sx={{ mr: 0.5, fontSize: '1.1rem', flexShrink: 0 }} />
                        <Typography variant="body2" component="span" fontWeight="medium">
                           Order Cancelled
                        </Typography>
                    </Box>
                 );
             case 'returned':
                 return (
                     <Box display="flex" alignItems="center" sx={{ color: 'warning.main', flexWrap: 'wrap' }}>
                        <KeyboardReturnIcon sx={{ mr: 0.5, fontSize: '1.1rem', flexShrink: 0 }} />
                        <Typography variant="body2" component="span" fontWeight="medium">
                           Order Returned
                        </Typography>
                    </Box>
                 );
            default:
                return null;
        }
    };

    return (
        <Paper onClick={()=>navigate(`/account/order/${5}`)} elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: '8px' }}> {/* Increased padding on sm+ */}
            {/* Increased container spacing */}
            <Grid container spacing={{ xs: 2, sm: 4 }} alignItems="center"> {/* Increased spacing on sm+ */}

                {/* --- Product Info Section --- */}
                {/* Increased width on sm breakpoint */}
                <Grid item xs={12} sm={7} md={6}> {/* More space: 7/12 on sm, 6/12 on md */}
                    <Box display="flex" alignItems="center" className="cursor-pointer">
                        <img
                            // Slightly larger image for more impact
                            className="w-20 h-20 object-cover object-top rounded flex-shrink-0"
                            src={imageUrl}
                            alt={title}
                        />
                        <Box ml={{ xs: 2, sm: 3 }}> {/* Increased margin on sm+ */}
                             {/* Add Order Number maybe */}
                             <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                ORDER #{orderNumber}
                             </Typography>
                            <Typography variant="subtitle1" fontWeight="medium" component="p" sx={{ mb: 0.5 }}> {/* Reduced bottom margin */}
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="p">
                                Size: {size}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="p">
                                Color: {color}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* --- Price Section --- */}
                {/* Adjusted width, kept relatively small */}
                <Grid item xs={5} sm={2} md={2}> {/* Explicit xs width, centered */}
                     {/* Center text on all screens for price */}
                    <Typography variant="body1" fontWeight="bold" textAlign="center">
                        {formatPrice(price)}
                    </Typography>
                </Grid>

                {/* --- Status Section --- */}
                {/* Adjusted width */}
                <Grid item xs={7} sm={3} md={4}> {/* Explicit xs width, remaining space on sm/md */}
                     {/* Align right on xs, left on sm+ */}
                     <Box textAlign={{ xs: 'right', sm: 'left' }} sx={{width: '100%'}}>
                         {renderStatus()}
                         {/* Actions below status */}
                         <Box mt={1}> {/* Add margin-top to separate actions */}
                             {status === 'delivered' && (
                                <Typography variant="caption" display="block" sx={{cursor: 'pointer', color: 'primary.main', '&:hover': {textDecoration: 'underline'}}}>
                                    Return/Replace
                                </Typography>
                             )}
                             {status === 'on_the_way' && (
                                <Typography variant="caption" display="block" sx={{cursor: 'pointer', color: 'primary.main', '&:hover': {textDecoration: 'underline'}}}>
                                    Track Package
                                </Typography>
                             )}
                              {/* Add more actions if needed */}
                             <Typography variant="caption" display="block" sx={{cursor: 'pointer', color: 'primary.main', '&:hover': {textDecoration: 'underline'}, mt: 0.5}}>
                                View Order Details
                            </Typography>
                         </Box>
                     </Box>
                </Grid>

            </Grid>
        </Paper>
    );
}

export default Ordercard;