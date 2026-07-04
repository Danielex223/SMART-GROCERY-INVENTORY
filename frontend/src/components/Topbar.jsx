import React from "react"

export default function Topbar({ theme, onToggle, onLogout }){
  return (
    <header className="topbar">
      <div className="tb-row">
        <div className="tb-left" />
        <div className="tb-actions">
          <div className="user-chip">
            <span className="user-name">Daniel</span>
            <span className="user-role">Employee</span>
          </div>
          <button className="btn secondary" onClick={onToggle}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button className="btn secondary" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </header>
  )
}
