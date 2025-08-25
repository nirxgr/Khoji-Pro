import { useState } from "react";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import RegistrationForm from "../../components/Register/RegistrationForm.tsx";
import OtpForm from "../../components/Register/OtpForm.tsx";
import { SignUpFormData } from "../../shared/interfaces/auth.interface.tsx";

const Register = () => {
  axios.defaults.withCredentials = true;

  const [signupData, setSignupData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [state, setState] = useState("Sign Up");

  const navigate = useNavigate();

  return (
    <div className="main-container">
      <img
        onClick={() => navigate("/")}
        src={assets.logo1}
        alt="Logo"
        className="logo"
      />

      {state === "Sign Up" ? (
        <div className="form-container">
          <h2 className="form-title">Sign Up</h2>
          <p className="form-subtitle">Create your account</p>
          <RegistrationForm setState={setState} setSignupData={setSignupData} />

          <p className="auth-toggle">
            Already have an account?{" "}
            <span className="toggle-link" onClick={() => navigate("/login")}>
              Login here
            </span>
          </p>
        </div>
      ) : (
        <div className="form-container">
          <h2 className="form-title">Email Verify OTP</h2>
          <p className="form-subtitle">
            Enter the 6-digit code sent to your email id
            <br />
            {signupData.email}.
          </p>
          <OtpForm signupData={signupData} type="register" />
        </div>
      )}
    </div>
  );
};

export default Register;
