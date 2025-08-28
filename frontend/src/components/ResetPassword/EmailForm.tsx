import { useForm } from "react-hook-form";
import { EmailFormData } from "../../shared/interfaces/auth.interface.tsx";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

interface EmailFormProps {
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  setIsEmailSent: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmailForm: React.FC<EmailFormProps> = ({
  setUserEmail,
  setIsEmailSent,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({ mode: "onSubmit" });

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitEmail = async (data: EmailFormData) => {
    try {
      const { email } = data;

      const response = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setUserEmail(email);
        response.data.success && setIsEmailSent(true);
        reset();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitEmail)}>
      <div className="input-components">
        <div className="input-wrapper">
          <div className="input-group">
            <img src={assets.mail_icon} alt="" />
            <input
              className="input-field"
              type="email"
              placeholder="Email id"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required.",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address.",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="form-error">{errors.email?.message}</p>
          )}
          {isSubmitting && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>

      <button className="submit-button" disabled={isSubmitting}>
        Submit
      </button>
      <p className="auth-toggle">
        Oh wait, you remember your password?{" "}
        <span className="toggle-link" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </form>
  );
};

export default EmailForm;
