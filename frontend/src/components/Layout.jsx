import React, { useEffect, useState } from "react"
import Sidebar from "./Sidebar.jsx"
import Topbar from "./Topbar.jsx"
import { clearToken } from "../api/client.js"

export default function Layout({ children }){
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved) return saved
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark" : "light"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Topbar
          theme={theme}
          onToggle={() => setTheme(t => t === "dark" ? "light" : "dark")}
          onLogout={() => { clearToken(); location.href="/login" }}
        />
        <main className="container">
          {children}
        </main>
      </div>
    </div>
  )
}
