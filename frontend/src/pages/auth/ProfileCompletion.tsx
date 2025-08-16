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
  const { backendUrl } = useContext(AppContext);

  const [location, setLocation] = useState("");
  const [profession, setProfession] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [linkedinId, setLinkedinId] = useState("");
  const [githubId, setGithubId] = useState("");
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
  const onSubmitHandler = async (e) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/update/completeProfile"
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/home");
      } else {
        toast.error(data.message);
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
                        onChange: (e) => setLocation(e.target.value),
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
                        onChange: (e) => setProfession(e.target.value), // merged version
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
                        onChange: (e) => setPhoneNumber(e.target.value),
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
                        onChange: (e) => setBio(e.target.value),
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
                      {...register("githubId", {
                        onChange: (e) => setGithubId(e.target.value),
                      })}
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
                      {...register("linkedinId", {
                        onChange: (e) => setLinkedinId(e.target.value),
                      })}
                    />
                  </div>
                  {errors.linkedinId?.message && (
                    <p className="form-error">{errors.linkedinId.message}</p>
                  )}
                </div>
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
              className="submit-button"
              disabled={isSubmitting}
              type="submit"
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
