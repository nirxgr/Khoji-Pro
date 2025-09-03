import { useForm } from "react-hook-form";
import { useContext } from "react";
import { LoginFormData } from "../../shared/interfaces/auth.interface.ts";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import "../../pages/auth/Auth.css";

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ mode: "onSubmit" });

  const { backendUrl, getUserData } = useContext(AppContext);

  const navigate = useNavigate();
  const onSubmitHandler = async (data: LoginFormData) => {
    try {
      axios.defaults.withCredentials = true;
      const { email, password } = data;

      const response = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        await getUserData();
        navigate("/home");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
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
              })}
            />
          </div>
          {errors.email && (
            <p className="form-error">{errors.email?.message}</p>
          )}
        </div>

        <div className="input-wrapper">
          <div className="input-group">
            <img src={assets.lock_icon} alt="" />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required.",
                },
              })}
            />
          </div>
          {errors.password && (
            <p className="form-error">{errors.password?.message}</p>
          )}
        </div>

        {isSubmitting && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        <p className="forgot-pass" onClick={() => navigate("/reset-password")}>
          Forgot Password
        </p>

        <button className="login-button">Login</button>
      </div>
    </form>
  );
};

export default LoginForm;
