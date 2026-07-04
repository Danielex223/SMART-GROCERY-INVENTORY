import React from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard.jsx"
import ItemsList from "./pages/ItemsList.jsx"
import ItemForm from "./pages/ItemForm.jsx"
import Reports from "./pages/Reports.jsx"
import NotFound from "./pages/NotFound.jsx"
import Suppliers from "./pages/Suppliers.jsx"
import Sales from "./pages/Sales.jsx"
import Layout from "./components/Layout.jsx"
import { getToken } from "./api/client.js"

function Private({ children }){
  const token = getToken()
  const loc = useLocation()
  if (!token) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route path="/" element={<Private><Layout><Dashboard /></Layout></Private>} />
      <Route path="/items" element={<Private><Layout><ItemsList /></Layout></Private>} />
      <Route path="/items/new" element={<Private><Layout><ItemForm mode="create" /></Layout></Private>} />
      <Route path="/items/:id/edit" element={<Private><Layout><ItemForm mode="edit" /></Layout></Private>} />
      <Route path="/reports" element={<Private><Layout><Reports /></Layout></Private>} />
      <Route path="/suppliers" element={<Private><Layout><Suppliers /></Layout></Private>} />
      <Route path="/sales" element={<Private><Layout><Sales /></Layout></Private>} />


      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
