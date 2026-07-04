import React from "react";
import { NavLink } from "react-router-dom";

const linkCls = ({ isActive }) => "s-link" + (isActive ? " active" : "");

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="s-brand">
        <div className="s-logo">🧊</div>
        <div>
          <div className="s-title">SmartStock</div>
          <div className="s-sub">Grocery Manager</div>
        </div>
      </div>

      <nav className="s-nav">
        <NavLink end to="/" className={linkCls}>🏠 Dashboard</NavLink>
        <NavLink to="/items" className={linkCls}>📦 Products</NavLink>
        <NavLink to="/reports" className={linkCls}>📊 Reports</NavLink>
        <NavLink to="/suppliers" className={linkCls}>🚚 Suppliers</NavLink>
        <NavLink to="/sales" className={linkCls}>🧾 Sales</NavLink>
      </nav>
    </aside>
  );
}
