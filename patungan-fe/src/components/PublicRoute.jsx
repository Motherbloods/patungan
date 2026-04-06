import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import LayoutSkeleton from "./LayoutSkeleton";
import PropTypes from "prop-types";

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

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
