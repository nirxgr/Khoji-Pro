import { useForm } from "react-hook-form";
import { SignUpFormData } from "../../shared/interfaces/auth.interface.tsx";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";

import axios from "axios";

interface RegistrationFormProps {
  setState: React.Dispatch<React.SetStateAction<string>>;
  setSignupData: React.Dispatch<React.SetStateAction<SignUpFormData>>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  setState,
  setSignupData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({ mode: "onSubmit" });

  const { backendUrl } = useContext(AppContext);

  const onSignUpSubmit = async (data: SignUpFormData) => {
    try {
      axios.defaults.withCredentials = true;

      const { firstName, lastName, email, password } = data;

      const response = await axios.post(backendUrl + "/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.data.success) {
        setSignupData(data);
        setState("Otp");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSignUpSubmit)}>
      <div className="input-components">
        <div className="input-wrapper">
          <div className="input-group">
            <img src={assets.person_icon} alt="" />
            <input
              className="input-field"
              type="text"
              placeholder="First Name"
              {...register("firstName", {
                required: {
                  value: true,
                  message: "First name is required.",
                },
              })}
            />
          </div>
          {errors.firstName && (
            <p className="form-error">{errors.firstName?.message}</p>
          )}
        </div>

        <div className="input-wrapper">
          <div className="input-group">
            <img src={assets.person_icon} alt="" />
            <input
              className="input-field"
              type="text"
              placeholder="Last Name"
              {...register("lastName", {
                required: {
                  value: true,
                  message: "Last name is required.",
                },
              })}
            />
          </div>
          {errors.lastName && (
            <p className="form-error">{errors.lastName?.message}</p>
          )}
        </div>

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
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
              })}
            />
          </div>
          {errors.password && (
            <p className="form-error">{errors.password?.message}</p>
          )}
          {isSubmitting && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>

      <button className="submit-button" disabled={isSubmitting} type="submit">
        Sign Up
      </button>
    </form>
  );
};

export default RegistrationForm;
