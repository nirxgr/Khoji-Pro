import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import "./Auth.css";
import { useForm } from "react-hook-form";

interface EmailFormData {
  email: string;
}

interface OtpFormData {
  otp0: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
}

interface NewPassFormData {
  newPassword: string;
}

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const [otpError, setOtpError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({ mode: "onSubmit" });

  const {
    register: resetOtp,
    handleSubmit: handleOtpSubmit,
    setValue: setOtpValue,
    formState: { isSubmitting: isSubmittingOtp },
  } = useForm<OtpFormData>({ mode: "onBlur" });

  const {
    register: newPass,
    handleSubmit: handlePassSubmit,
    formState: { errors: passErrors, isSubmitting: isSubmittingPass },
  } = useForm<NewPassFormData>({ mode: "onSubmit" });

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

  const onSubmitOTP = async (data: OtpFormData) => {
    const otpValues = Object.values(data);
    const isEmpty = otpValues.some((v) => v.trim() === "");
    if (isEmpty) {
      setOtpError("Please enter all 6 digits");
      return;
    }
    setOtpError("");
    const otp = otpValues.join("");

    try {
      const response = await axios.post(backendUrl + "/api/auth/check-otp", {
        email: userEmail,
        otp,
      });
      if (response.data.success) {
        setIsOtpSubmitted(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitNewPassword = async (data: NewPassFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const { newPassword } = data;

      const response = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email: userEmail, newPassword }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
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

      {/* for email id */}
      {!isEmailSent && (
        <div className="form-container">
          <h2 className="form-title">Reset Password</h2>
          <p className="form-subtitle">Enter your registered email address.</p>
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
        </div>
      )}

      {/*otp input form*/}

      {!isOtpSubmitted && isEmailSent && (
        <div className="form-container">
          <h2 className="form-title">Reset Password OTP</h2>
          <p className="form-subtitle">
            Enter the 6-digit code sent to your email id.
          </p>

          <form onSubmit={handleOtpSubmit(onSubmitOTP)}>
            <div className="otp-container" onPaste={handlePaste}>
              {Array.from({ length: 6 }).map((_, index) => {
                const fieldName = `otp${index}` as keyof OtpFormData;
                return (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="otp-input"
                    {...resetOtp(fieldName)}
                    ref={(el) => {
                      resetOtp(fieldName).ref(el);
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

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* enter new password */}
      {isOtpSubmitted && isEmailSent && (
        <div className="form-container">
          <h2 className="form-title">New Password</h2>
          <p className="form-subtitle">Enter the new password below.</p>
          <form onSubmit={handlePassSubmit(onSubmitNewPassword)}>
            <div className="input-components">
              <div className="input-wrapper">
                <div className="input-group">
                  <img src={assets.lock_icon} alt="" />
                  <input
                    className="input-field"
                    type="password"
                    placeholder="New Password"
                    {...newPass("newPassword", {
                      required: {
                        value: true,
                        message: "Password is required.",
                      },
                    })}
                  />
                </div>
                {passErrors.newPassword && (
                  <p className="form-error">
                    {passErrors.newPassword?.message}
                  </p>
                )}
                {isSubmittingPass && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
            </div>
            <button className="submit-button" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
