import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "../common/Button";

const PaymentForm = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (error) {
      onError(error.message);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-6">Payment</h2>
      <div className="border rounded-lg p-4 mb-4">
        <CardElement options={{
          style: {
            base: { fontSize: "16px", color: "#374151", "::placeholder": { color: "#9ca3af" } },
          },
        }} />
      </div>
      <Button type="submit" loading={loading} disabled={!stripe} className="w-full">
        Pay Now
      </Button>
    </form>
  );
};

export default PaymentForm;
