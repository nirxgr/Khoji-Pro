import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import "./Auth.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

type ProfileFormValues = {
  location: string;
  profession: string;
  phoneNumber: string;
  bio: string;
  linkedinId: string;
  githubId: string;
};

const ProfileCompletion = () => {
  const { backendUrl, setUserData } = useContext(AppContext);
  const [state, setState] = useState("Profile1");

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ mode: "onBlur" });

  const navigate = useNavigate();

  const handleNext = async () => {
    const isStepValid = await trigger([
      "location",
      "profession",
      "phoneNumber",
      "bio",
    ]);
    if (isStepValid) {
      setState("Profile2");
    }
  };

  const onSubmitHandler = async (formData: ProfileFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
    <div className="main-container">
      <img
        onClick={() => navigate("/")}
        src={assets.logo1}
        alt="Logo"
        className="logo"
      />

      <div className="form-container">
        <h2 className="form-title">Complete Your Profile</h2>
        <p className="form-subtitle">
          {state === "Profile1"
            ? "Just a few more steps to complete your profile."
            : "Add your social links (optional)."}
        </p>

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

            {state === "Profile2" && (
              <>
                <div className="input-wrapper">
                  <div className="input-group">
                    <img src={assets.location2} alt="" />
                    <input
                      className="input-field"
                      type="text"
                      placeholder="Github Id"
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
                      placeholder="Linkedin Id"
                      {...register("linkedinId", {})}
                    />
                  </div>
                  {errors.linkedinId?.message && (
                    <p className="form-error">{errors.linkedinId.message}</p>
                  )}
                </div>
                {isSubmitting && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
              </>
            )}
          </div>

          {state === "Profile1" && (
            <button
              className="submit-button"
              type="button"
              onClick={handleNext}
            >
              Next
            </button>
          )}

          {state === "Profile2" && (
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;
