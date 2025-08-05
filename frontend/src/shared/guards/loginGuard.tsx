import type { JSX} from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from "../../context/AppContext.jsx"

interface LoginGuardProps {
    children: JSX.Element;
}

const LoginGuard = ({ children }: LoginGuardProps) => {
    const {isLoggedin, authReady} = useContext(AppContext)
    
    if (!authReady) return null;

    if (isLoggedin) {
        return <Navigate to="/home" replace />;
    } else {
        return children;
    }
};

export default LoginGuard;
