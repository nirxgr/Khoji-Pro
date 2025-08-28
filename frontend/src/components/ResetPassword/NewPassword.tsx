import { useForm } from "react-hook-form";
import { NewPassFormData } from "../../shared/interfaces/auth.interface.tsx";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

interface NewPassFormProps {
  userEmail: string;
}

const NewPasswordForm: React.FC<NewPassFormProps> = ({ userEmail }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPassFormData>({ mode: "onSubmit" });

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  const onSubmitNewPassword = async (data: NewPassFormData) => {
    try {
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
    <form onSubmit={handleSubmit(onSubmitNewPassword)}>
      <div className="input-components">
        <div className="input-wrapper">
          <div className="input-group">
            <img src={assets.lock_icon} alt="" />
            <input
              className="input-field"
              type="password"
              placeholder="New Password"
              {...register("newPassword", {
                required: {
                  value: true,
                  message: "Password is required.",
                },
              })}
            />
          </div>
          {errors.newPassword && (
            <p className="form-error">{errors.newPassword?.message}</p>
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
    </form>
  );
};

export default NewPasswordForm;
