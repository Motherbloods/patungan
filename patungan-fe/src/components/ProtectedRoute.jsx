import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import LayoutSkeleton from "./LayoutSkeleton";
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LayoutSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
