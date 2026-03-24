import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./env.js";
import PublicRoute from "../components/PublicRoute.jsx";
import Login from "../pages/Login.jsx";

export default function LoginRoute() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PublicRoute>
        <Login />
      </PublicRoute>
    </GoogleOAuthProvider>
  );
}
