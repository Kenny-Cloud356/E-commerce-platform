import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { authService } from "../../services/authService";
import { isValidEmail } from "../../utils/validators";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setError("Please enter a valid email");
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Check your email</h3>
        <p className="text-gray-600">If an account exists for {email}, we've sent a password reset link.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
    </form>
  );
};

export default ForgotPasswordForm;
