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
import AddLeadPage from "../app/leads/AddLeadPage";
import PublicRoute from "./public";
import DetailLeadPage from "../app/leads/DetailLeadPage";
import EditLeadPage from "../app/leads/EditLeadPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<DetailLeadPage />} />
            <Route path="/leads/edit/:id" element={<EditLeadPage />} />
            <Route path="/leads/add-lead" element={<AddLeadPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
