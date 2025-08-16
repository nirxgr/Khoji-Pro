import type { JSX } from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";

interface AuthGuardProps {
  children: JSX.Element;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoggedin, authReady } = useContext(AppContext);

  if (!authReady) return null;

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  } else {
    return children;
  }
};

export default AuthGuard;
