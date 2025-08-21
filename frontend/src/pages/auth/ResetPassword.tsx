import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./Auth.css";
import OtpForm from "../../components/Register/OtpForm.tsx";
import EmailForm from "../../components/ResetPassword/EmailForm.tsx";
import NewPasswordForm from "../../components/ResetPassword/NewPassword.tsx";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  // const onSubmitNewPassword = async (data: NewPassFormData) => {
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     const { newPassword } = data;

  //     const response = await axios.post(
  //       backendUrl + "/api/auth/reset-password",
  //       { email: userEmail, newPassword }
  //     );
  //     if (response.data.success) {
  //       toast.success(response.data.message);
  //       navigate("/login");
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  return (
    <div className="main-container">
      <img
        onClick={() => navigate("/")}
        src={assets.logo1}
        alt="Logo"
        className="logo"
      />

      {!isEmailSent && (
        <div className="form-container">
          <h2 className="form-title">Reset Password</h2>
          <p className="form-subtitle">Enter your registered email address.</p>

          <EmailForm
            setIsEmailSent={setIsEmailSent}
            setUserEmail={setUserEmail}
          />
        </div>
      )}

      {/*otp input form*/}

      {!isOtpSubmitted && isEmailSent && (
        <div className="form-container">
          <h2 className="form-title">Reset Password OTP</h2>
          <p className="form-subtitle">
            Enter the 6-digit code sent to your email id.
          </p>

          <OtpForm
            type="reset"
            userEmail={userEmail}
            setIsOtpSubmitted={setIsOtpSubmitted}
          />
        </div>
      )}

      {/* enter new password */}
      {isOtpSubmitted && isEmailSent && (
        <div className="form-container">
          <h2 className="form-title">New Password</h2>
          <p className="form-subtitle">Enter the new password below.</p>
          <NewPasswordForm userEmail={userEmail} />
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
