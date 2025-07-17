import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../../AppWrapper"
import Loader from "../../utility/Loader"

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(Context);
  useEffect(() => {
    console.log("ProtectedRoute - loading:", loading, "isAuthenticated:", isAuthenticated);
  }, [loading, isAuthenticated]);

  if (loading || !isAuthenticated) return <Loader />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
