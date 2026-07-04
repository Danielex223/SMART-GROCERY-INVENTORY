// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, setToken } from "../api/client.js";

export default function Login() {
  const [email, setEmail] = useState("demo@example.com");
  const [pwd, setPwd] = useState("password");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (!email || !pwd) throw new Error("Please fill in all fields.");

      const res = await api.login(email.trim(), pwd);

      // 🔥 Save token
      setToken(res.token);

      // 🔥 Save full user information into localStorage
      localStorage.setItem("user", JSON.stringify(res.user));

      // redirect to dashboard or previous page
      nav(loc.state?.from?.pathname || "/");
    } catch (e) {
      setErr(e.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ebf5ff 0%, #f8fbff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
      }}
    >
      <div
        className="card"
        style={{
          width: "400px",
          background: "#fff",
          borderRadius: "16px",
          padding: "32px 28px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: "#0ea5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              margin: "0 auto 10px",
            }}
          >
            🛒
          </div>
          <h2 style={{ marginBottom: 4, color: "#0f172a" }}>SmartStock</h2>
          <p style={{ color: "#6b7280", fontSize: ".95rem" }}>
            Grocery Inventory Manager
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          <label style={{ fontWeight: 600, fontSize: ".95rem" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          />

          <label style={{ fontWeight: 600, fontSize: ".95rem" }}>Password</label>
          <div
            style={{
              position: "relative",
              marginBottom: "12px",
            }}
          >
            <input
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              disabled={loading}
              required
              style={{
                width: "100%",
                padding: "12px 40px 12px 14px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
              }}
            />
            <span
              onClick={() => setShowPwd(!showPwd)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6b7280",
                fontSize: ".9rem",
                userSelect: "none",
              }}
              title={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? "🙈" : "👁️"}
            </span>
          </div>

          {err && (
            <p
              style={{
                color: "#ef4444",
                background: "#fee2e2",
                borderRadius: 8,
                padding: "8px 10px",
                marginBottom: "12px",
                fontSize: ".9rem",
                textAlign: "center",
              }}
            >
              {err}
            </p>
          )}

          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#0ea5e9",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background .2s ease",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Demo info */}
          <p
            style={{
              color: "#6b7280",
              textAlign: "center",
              marginTop: "14px",
              fontSize: ".9rem",
            }}
          >
            Demo: <b>demo@example.com</b> / <b>password</b>
          </p>

          {/* REGISTER LINK */}
          <p
            style={{
              marginTop: "10px",
              textAlign: "center",
              fontSize: ".9rem",
            }}
          >
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "#0ea5e9", fontWeight: 600 }}>
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
