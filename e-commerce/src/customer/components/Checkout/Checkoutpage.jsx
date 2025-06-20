import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import DeliveryAdressForm from "./DeliveryAdressForm";
import OrderSummary from "./OrderSummary";

const steps = ["Login", "Delivery Address", "Order Summary", "Payment"];

function getStepContent(step, goToNextStep, address, order, orderId) {
  switch (step) {
    case 0:
      return <Typography sx={{ mt: 2, mb: 1 }}>Login Component Placeholder</Typography>;
    case 1:
      return <DeliveryAdressForm goToNextStep={goToNextStep} order={order} />;
    case 2:
      return <OrderSummary address={address} order={order} orderId={orderId} goToNextStep={goToNextStep} />;
    case 3:
      return <Typography sx={{ mt: 2, mb: 1 }}>Redirecting to Payment...</Typography>;
    default:
      return <Typography sx={{ mt: 2, mb: 1 }}>Unknown step</Typography>;
  }
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const querySearch = new URLSearchParams(location.search);

  const getStepFromQuery = () => {
    const stepParam = querySearch.get("step");
    const step = parseInt(stepParam, 10);
    return !isNaN(step) && step >= 0 && step < steps.length ? step : location.state?.fromCart ? 1 : 0;
  };

  const [activeStep, setActiveStep] = React.useState(getStepFromQuery());
  const [address, setAddress] = React.useState(null);
  const [order, setOrder] = React.useState(location.state?.cartItems || []);
  const [orderId, setOrderId] = React.useState(null);

  const goToNextStep = async (selectedAddress, selectedOrder, selectedOrderId) => {
    setAddress(selectedAddress);
    setOrder(selectedOrder);
    setOrderId(selectedOrderId);
    const nextStep = Math.min(activeStep + 1, steps.length - 1);
    setActiveStep(nextStep);

    if (nextStep === 3 && selectedOrderId) {
      try {
        // Call backend to get payment link
        const response = await fetch(`http://localhost:5454/api/payments/${selectedOrderId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok && data.paymentLink) {
          // Redirect to payment link
          window.location.href = data.paymentLink;
        } else {
          throw new Error(data.message || "Failed to generate payment link");
        }
      } catch (error) {
        console.error("Payment link error:", error);
        alert("Failed to generate payment link. Please try again.");
        setActiveStep(2); // Revert to Order Summary on error
        navigate(`?step=2`);
      }
    } else {
      navigate(`?step=${nextStep}`);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
      navigate(`?step=${activeStep - 1}`);
    }
  };

  return (
    <div className="px-10 lg:px-20 mt-10">
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <Typography sx={{ mt: 4, mb: 1, textAlign: "center" }}>
            Order Placed Successfully!
          </Typography>
        ) : (
          <Box sx={{ mt: 3, mb: 1, py: 3 }}>
            {getStepContent(activeStep, goToNextStep, address, order, orderId)}
          </Box>
        )}

        {activeStep < steps.length && (
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
}