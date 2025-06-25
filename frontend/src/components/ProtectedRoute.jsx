import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// This component protects routes from unauthenticated access
export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
