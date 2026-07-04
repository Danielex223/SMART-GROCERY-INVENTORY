import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../api/client.js";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (!name || !email || !pwd) throw new Error("Fill all fields");

      const res = await api.register(name.trim(), email.trim(), pwd);
      setToken(res.token);

      nav("/");
    } catch (e) {
      setErr(e.message || "Register failed");
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
      }}
    >
      <div
        className="card"
        style={{
          width: "400px",
          padding: "32px 28px",
          borderRadius: "16px",
        }}
      >
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>Create Account</h2>

        <form onSubmit={submit}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
            required
          />

          <label>Password</label>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              style={{ width: "100%", paddingRight: 40 }}
              required
            />
            <span
              onClick={() => setShowPwd(!showPwd)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPwd ? "🙈" : "👁️"}
            </span>
          </div>

          {err && (
            <p
              style={{
                background: "#fee2e2",
                padding: 10,
                borderRadius: 8,
                color: "#ef4444",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {err}
            </p>
          )}

          <button className="btn" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: "center", color: "#6b7280" }}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
