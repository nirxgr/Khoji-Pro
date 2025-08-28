import { useForm } from "react-hook-form";
import { ProfileFormValues } from "../../shared/interfaces/auth.interface.tsx";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";
import "../../pages/auth/Auth.css";

interface ProfileCompletionFormProps {
  setState: React.Dispatch<React.SetStateAction<string>>;
  state: string;
}

const ProfileCompletionForm: React.FC<ProfileCompletionFormProps> = ({
  setState,
  state,
}) => {
  const {
    register,
    trigger,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ mode: "onSubmit" });

  const navigate = useNavigate();
  const { backendUrl, setUserData } = useContext(AppContext);

  const handleNext = async () => {
    const isStepValid: boolean = await trigger(["location", "profession"]);
    if (isStepValid) {
      setState("Profile2");
    }
  };

  const onSubmitHandler = async (formData: ProfileFormValues) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${backendUrl}/api/update/completeProfile`,
        formData
      );
      if (response.data.success) {
        setUserData((prev) =>
          prev ? { ...prev, profileStatus: "Completed" } : prev
        );
        toast.success(response.data.message);
        navigate("/home");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="input-components">
        {state === "Profile1" && (
          <>
            <div className="input-wrapper">
              <div className="input-group">
                <img src={assets.location2} alt="" />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Location"
                  {...register("location", {
                    required: {
                      value: true,
                      message: "Location is required.",
                    },
                  })}
                />
              </div>
              {errors.location?.message && (
                <p className="form-error">{errors.location.message}</p>
              )}
            </div>

            <div className="input-wrapper">
              <div className="input-group">
                <img src={assets.profession} alt="" />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Designation"
                  {...register("profession", {
                    required: {
                      value: true,
                      message: "Designation is required.",
                    },
                  })}
                />
              </div>
              {errors.profession?.message && (
                <p className="form-error">{errors.profession.message}</p>
              )}
            </div>
            <div className="input-wrapper">
              <div className="input-group">
                <img src={assets.location2} alt="" />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Github Id Link (Optional)"
                  {...register("githubId", {})}
                />
              </div>
              {errors.githubId?.message && (
                <p className="form-error">{errors.githubId.message}</p>
              )}
            </div>

            <div className="input-wrapper">
              <div className="input-group">
                <img src={assets.profession} alt="" />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Linkedin Id Link (Optional)"
                  {...register("linkedinId", {})}
                />
              </div>
              {errors.linkedinId?.message && (
                <p className="form-error">{errors.linkedinId.message}</p>
              )}
            </div>
          </>
        )}

        {state === "Profile2" && (
          <>
            <div className="input-wrapper">
              <div className="input-group">
                <img src={assets.phone} alt="" />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Phone Number"
                  {...register("phoneNumber", {
                    required: {
                      value: true,
                      message: "Phone Number is required.",
                    },
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone Number must be exactly 10 digits",
                    },
                  })}
                />
              </div>
              {errors.phoneNumber?.message && (
                <p className="form-error">{errors.phoneNumber.message}</p>
              )}
            </div>
            <div className="input-wrapper">
              <div className="input-group">
                <textarea
                  className="text-field"
                  placeholder="Bio"
                  {...register("bio", {
                    required: {
                      value: true,
                      message: "Bio is required.",
                    },
                  })}
                />
              </div>
              {errors.bio?.message && (
                <p className="form-error">{errors.bio.message}</p>
              )}
            </div>
          </>
        )}
      </div>

      {state === "Profile1" && (
        <button className="submit-button" type="button" onClick={handleNext}>
          Next
        </button>
      )}

      {state === "Profile2" && (
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          Submit
        </button>
      )}

      {isSubmitting && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </form>
  );
};

export default ProfileCompletionForm;
