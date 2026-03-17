import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PublicRoute;
