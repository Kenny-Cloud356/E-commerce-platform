import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/validators";

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(form.email)) return setError("Please enter a valid email");
    if (!form.password) return setError("Password is required");

    setLoading(true);
    try {
      await login(form.email, form.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
      <Input label="Email" type="email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
      <Input label="Password" type="password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
      <Button type="submit" loading={loading} className="w-full">Log In</Button>
      <div className="text-center text-sm text-gray-500">
        <Link to="/forgot-password" className="text-primary-600 hover:underline">Forgot password?</Link>
        <span className="mx-2">|</span>
        <Link to="/register" className="text-primary-600 hover:underline">Create account</Link>
      </div>
    </form>
  );
};

export default LoginForm;
