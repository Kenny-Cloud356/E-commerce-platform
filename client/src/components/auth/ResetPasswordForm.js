import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { authService } from "../../services/authService";
import { getPasswordError } from "../../utils/validators";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwError = getPasswordError(form.password);
    if (pwError) return setError(pwError);
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(token, form.password);
      navigate("/login", { state: { message: "Password reset successful. Please log in." } });
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Token may have expired.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
      <Input label="New Password" type="password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters with a number" />
      <Input label="Confirm Password" type="password" value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat your password" />
      <Button type="submit" loading={loading} className="w-full">Reset Password</Button>
    </form>
  );
};

export default ResetPasswordForm;
