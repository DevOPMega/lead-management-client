import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../app/auth/LoginPage";
import DashboardPage from "../app/dashboard/DashboardPage";
import Leads from "../app/leads/LeadsPage";
import Layout from "@/components/layout"
import ProtectedRoute from "./protected";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute  />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<Leads />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
