import React, { useContext, useState } from "react";
import { IUser } from "../../shared/interfaces/user.interface";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import ProfileDetailsForm from "./ProfileDetailsForm";

interface ProfileSectionProps {
  user: IUser;
  isOwner: boolean;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileDetailsSection: React.FC<ProfileSectionProps> = ({
  user,
  isOwner,
  setReloadUser,
}) => {
  const [showForm, setShowForm] = useState(false);
  const { backendUrl } = useContext(AppContext);

  return (
    <div className="profile-section-first">
      <div className="profile-name">
        <h1>
          {user?.firstName || "---"} {user.lastName || "---"}
        </h1>
        {isOwner && (
          <button
            className="edit-btn"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <img src={assets.pencil} alt="edit-icon" className="edit-icon" />
          </button>
        )}

        {showForm && user && (
          <ProfileDetailsForm
            user={user}
            backendUrl={backendUrl}
            setReloadUser={setReloadUser}
            setShowForm={setShowForm}
          />
        )}

        <p className="profession">{user.profession || "---"}</p>
        <p className="location">
          <img
            src={assets.location}
            alt="location icon"
            className="location-icon"
          />
          {user.location || "---"}
        </p>
      </div>
      <div className="profile-bio">{user.bio || "---"}</div>
    </div>
  );
};

export default ProfileDetailsSection;
