import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

/**
 * Supplier login with phone number and OTP or password
 * Save/overwrite as: src/pages/SupplierLogin.jsx
 */
export default function SupplierLogin() {
  const [form, setForm] = useState({ phone: "", password: "", otp: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function sendOTP() {
    setErr("");
    setSuccess("");
    setLoading(true);

    if (!form.phone) {
      setErr("Please provide a phone number.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/suppliers/send-otp", { phone: form.phone });
      if (res.data.success) {
        setSuccess(`OTP sent to ${form.phone}. Check console (OTP: ${res.data.otp})`);
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setErr(error?.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);

    if (!form.phone) {
      setErr("Please provide a phone number.");
      setLoading(false);
      return;
    }

    try {
      const loginData = { phone: form.phone };
      if (usePassword) {
        if (!form.password) {
          setErr("Please enter your password.");
          setLoading(false);
          return;
        }
        loginData.password = form.password;
      } else {
        if (!form.otp) {
          setErr("Please enter the OTP.");
          setLoading(false);
          return;
        }
        loginData.otp = form.otp;
      }

      const res = await axios.post("/api/suppliers/login", loginData, { withCredentials: true });
      
      if (res.data.ok) {
        setSuccess("Login successful!");
        navigate("/supplier/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErr(error?.response?.data?.error || "Failed to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 24 }}>Supplier Sign In</h1>

      {err && <div style={{ color: "red", marginBottom: 12, padding: 10, background: "#ffebee", borderRadius: 4 }}>{err}</div>}
      {success && <div style={{ color: "green", marginBottom: 12, padding: 10, background: "#e8f5e9", borderRadius: 4 }}>{success}</div>}

      <form onSubmit={submit} style={{ maxWidth: 420 }}>
        <label style={{ display: "block", marginBottom: 12 }}>
          Phone Number
          <br />
          <input 
            type="text" 
            value={form.phone} 
            onChange={update("phone")} 
            placeholder="Enter phone (e.g., 9876543210)"
            style={{ width: "100%", padding: 10, marginTop: 8, fontSize: 14, border: "1px solid #ccc", borderRadius: 4 }} 
            required 
          />
        </label>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input 
              type="checkbox" 
              checked={usePassword} 
              onChange={(e) => {
                setUsePassword(e.target.checked);
                setOtpSent(false);
                setForm({ ...form, otp: "", password: "" });
              }}
            />
            <span>Login with password instead of OTP</span>
          </label>
        </div>

        {!usePassword ? (
          <>
            {!otpSent ? (
              <button 
                type="button"
                onClick={sendOTP}
                style={{ 
                  padding: "10px 20px", 
                  background: "#1976d2", 
                  color: "white",
                  border: "none", 
                  cursor: "pointer",
                  borderRadius: 4,
                  fontSize: 16,
                  marginBottom: 12
                }} 
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <label style={{ display: "block", marginBottom: 12 }}>
                Enter OTP
                <br />
                <input 
                  type="text" 
                  value={form.otp} 
                  onChange={update("otp")} 
                  placeholder="6-digit OTP"
                  maxLength={6}
                  style={{ width: "100%", padding: 10, marginTop: 8, fontSize: 14, border: "1px solid #ccc", borderRadius: 4 }} 
                  required 
                />
              </label>
            )}
          </>
        ) : (
          <label style={{ display: "block", marginBottom: 12 }}>
            Password
            <br />
            <input 
              type="password" 
              value={form.password} 
              onChange={update("password")} 
              placeholder="Enter your password"
              style={{ width: "100%", padding: 10, marginTop: 8, fontSize: 14, border: "1px solid #ccc", borderRadius: 4 }} 
              required 
            />
          </label>
        )}

        {(otpSent || usePassword) && (
          <div style={{ marginTop: 12 }}>
            <button 
              type="submit" 
              style={{ 
                padding: "10px 20px", 
                background: "#ffd600", 
                border: "none", 
                cursor: "pointer",
                borderRadius: 4,
                fontSize: 16,
                fontWeight: "bold"
              }} 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}
      </form>

      <p style={{ marginTop: 24, color: "#666" }}>
        Don't have an account? <a href="/supplier/register" style={{ color: "#1976d2", textDecoration: "underline" }}>Register Here</a>
      </p>
    </main>
  );
}
