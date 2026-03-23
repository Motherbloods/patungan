import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import LayoutSkeleton from "./LayoutSkeleton";
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LayoutSkeleton />;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PublicRoute;
