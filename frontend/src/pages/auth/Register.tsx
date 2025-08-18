import React, { useContext, useState, useRef } from "react";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import "./Auth.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface OtpFormData {
  otp0: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
}

const Register = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl } = useContext(AppContext);

  const [signupData, setSignupData] = useState({});
  const [state, setState] = useState("Sign Up");
  const [otpError, setOtpError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({ mode: "onBlur" });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    setValue: setOtpValue,
    formState: { isSubmitting: isSubmittingOtp },
  } = useForm<OtpFormData>({ mode: "onBlur" });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const { value } = e.currentTarget;

    if (!/^\d*$/.test(value)) {
      e.currentTarget.value = "";
      return;
    }

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, inputRefs.current.length);

    paste.split("").forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char;
        setOtpValue(`otp${i}` as keyof OtpFormData, char);
      }
    });

    const lastIndex = Math.min(paste.length - 1, inputRefs.current.length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  const navigate = useNavigate();

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
    } finally {
      reset();
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    const otpValues = Object.values(data);
    const isEmpty = otpValues.some((v) => v.trim() === "");
    if (isEmpty) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setOtpError("");
    const otp = otpValues.join("");

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        {
          ...signupData,
          otp,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/complete-profile");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
                {isSubmittingOtp && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="submit-button"
              disabled={isSubmitting}
              type="submit"
            >
              Sign Up
            </button>
          </form>

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
            Enter the 6-digit code sent to your email id.
          </p>

          <form onSubmit={handleOtpSubmit(onOtpSubmit)}>
            <div className="otp-container" onPaste={handlePaste}>
              {Array.from({ length: 6 }).map((_, index) => {
                const fieldName = `otp${index}` as keyof OtpFormData;
                return (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="otp-input"
                    {...registerOtp(fieldName)}
                    ref={(el) => {
                      registerOtp(fieldName).ref(el);
                      inputRefs.current[index] = el;
                    }}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                );
              })}
            </div>

            {otpError && <p className="otp-error">{otpError}</p>}

            {isSubmittingOtp && (
              <div className="loading-overlay">
                <div className="spinner"></div>
              </div>
            )}

            <button type="submit" className="submit-button">
              Verify Email
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
