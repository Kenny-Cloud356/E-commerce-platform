import api from "./api";

export const paymentService = {
  createPaymentIntent: (amount) => api.post("/payments/create-intent", { amount }),
};
