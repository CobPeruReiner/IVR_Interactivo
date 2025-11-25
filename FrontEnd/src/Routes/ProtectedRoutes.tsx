import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const { auth } = useContext(AuthContext);

  if (!auth.logged) return <Navigate to="/login" replace />;

  return <Outlet />;
};
