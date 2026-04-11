import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ShippingForm from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import OrderConfirmation from "./OrderConfirmation";
import { orderService } from "../../services/orderService";
import { toast } from "react-toastify";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY || "pk_test_placeholder");

const CheckoutForm = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "", country: "US" });
  const [clientSecret, setClientSecret] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleShippingNext = async () => {
    try {
      const { data } = await orderService.createOrder(address);
      setClientSecret(data.data.clientSecret);
      setOrder(data.data.order);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    }
  };

  const handlePaymentSuccess = () => setStep(3);
  const handlePaymentError = (msg) => setError(msg);

  if (step === 3) return <OrderConfirmation order={order} />;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex-1 h-1 rounded ${step >= 1 ? "bg-primary-600" : "bg-gray-200"}`} />
        <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-primary-600" : "bg-gray-200"}`} />
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      {step === 1 && <ShippingForm address={address} onChange={setAddress} onNext={handleShippingNext} />}

      {step === 2 && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutForm;
