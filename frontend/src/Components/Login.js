import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Components/Service/Context";
import "./Login.css";

const API_URL = "http://localhost:5000";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("Both email and password are required.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="login-input"
        />
        <div className="login-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot your password?
          </Link>
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      {message && <p className="login-message">{message}</p>}
      <Link to="/signup" className="signup-link">
        Don't have an account? Signup
      </Link>
    </div>
  );
};

export default Login;
