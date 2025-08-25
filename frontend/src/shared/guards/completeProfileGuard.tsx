import type { JSX } from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";

interface CompleteProfileGuardProps {
  children: JSX.Element;
}

const CompleteProfileGuard = ({ children }: CompleteProfileGuardProps) => {
  const { isLoggedin, authReady, userData } = useContext(AppContext);

  if (!authReady) return null;

  if (!isLoggedin) {
    return <Navigate to="/" replace />;
  }

  if (userData?.profileStatus === "Completed") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default CompleteProfileGuard;
