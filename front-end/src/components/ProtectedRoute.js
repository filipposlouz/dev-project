import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  return role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
