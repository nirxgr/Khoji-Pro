import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import LoginForm from "../../components/Login/LoginForm.tsx";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <img
        onClick={() => navigate("/")}
        src={assets.logo1}
        alt="Logo"
        className="logo"
      />

      <div className="form-container">
        <h2 className="form-title">Login</h2>
        <p className="form-subtitle">Login to your account!</p>

        <LoginForm />

        <p className="auth-toggle">
          Don't have an account?{" "}
          <span className="toggle-link" onClick={() => navigate("/register")}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
