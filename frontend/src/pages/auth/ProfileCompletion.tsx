import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import "./Auth.css";
import Header from "../../components/Header/Header.tsx";
import ProfileCompletionForm from "../../components/ProfileCompletion/ProfileCompletionForm.tsx";

const ProfileCompletion = () => {
  const { setUserData } = useContext(AppContext);
  const [state, setState] = useState("Profile1");

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="main-container">
        <div className="form-container">
          <h2 className="form-title">Complete Your Profile</h2>
          <p className="form-subtitle">
            Just a few more steps to complete your profile.
          </p>
          <ProfileCompletionForm setState={setState} state={state} />
        </div>
      </div>
    </>
  );
};

export default ProfileCompletion;
