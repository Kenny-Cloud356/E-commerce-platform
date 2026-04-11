import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail, getPasswordError } from "../../utils/validators";

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required");
    if (!isValidEmail(form.email)) return setError("Please enter a valid email");
    const pwError = getPasswordError(form.password);
    if (pwError) return setError(pwError);
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
      <Input label="Full Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
      <Input label="Email" type="email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
      <Input label="Password" type="password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters with a number" />
      <Input label="Confirm Password" type="password" value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat your password" />
      <Button type="submit" loading={loading} className="w-full">Create Account</Button>
      <p className="text-center text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Log in</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
