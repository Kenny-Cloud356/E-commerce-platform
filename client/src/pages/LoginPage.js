import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <LoginForm onSuccess={() => navigate("/")} />
      </div>
    </div>
  );
};

export default LoginPage;
