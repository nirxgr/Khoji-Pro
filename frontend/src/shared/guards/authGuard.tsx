import type { JSX } from "react";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";

interface AuthGuardProps {
  children: JSX.Element;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoggedin, authReady, userData } = useContext(AppContext);
  const location = useLocation();

  if (!authReady) return null;

  if (!isLoggedin) {
    return <Navigate to="/" replace />;
  }

  if (
    userData?.profileStatus === "Incomplete" &&
    location.pathname !== "/complete-profile"
  ) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default AuthGuard;
