import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../../shared/interfaces/user.interface";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import ProfileDetailsForm from "./ProfileDetailsForm";
import axios from "axios";
import { toggleFavorite } from "../../shared/service/favorite.service";

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
  const { backendUrl, userData, getUserData } = useContext(AppContext);

  const isUserFavorite = userData.favorites?.includes(user._id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    try {
      await toggleFavorite(backendUrl, user._id.toString(), isUserFavorite);
      await getUserData();
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);

  return (
    <div className="profile-section-first">
      <div className="profile-name">
        <h1 className="profile-section-title">
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
        {!isOwner && (
          <button className="edit-btn" onClick={handleToggleFavorite}>
            <img
              src={isUserFavorite ? assets.favorite : assets.unfavorite}
              alt="edit-icon"
              className="favorite-icon"
            />
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

        <div className="location-details">
          <img src={assets.location} />
          <p>{user.location || "---"}</p>
        </div>
      </div>
      <div className="profile-bio">{user.bio || "---"}</div>
    </div>
  );
};

export default ProfileDetailsSection;
