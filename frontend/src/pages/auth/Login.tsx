import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext.jsx";
import { useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { backendUrl, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ mode: "onSubmit" });

  const onSubmitHandler = async (data: LoginFormData) => {
    try {
      axios.defaults.withCredentials = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
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

            <p
              className="forgot-pass"
              onClick={() => navigate("/reset-password")}
            >
              Forgot Password
            </p>

            <button className="login-button">Login</button>
          </div>
        </form>

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
