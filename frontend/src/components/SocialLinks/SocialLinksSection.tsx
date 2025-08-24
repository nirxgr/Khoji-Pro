import React, { useContext, useState } from "react";
import SocialLinksForm from "./SocialLinksForm";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { IUser } from "../../shared/interfaces/user.interface";

interface SocialSectionProps {
  user: IUser;
  isOwner: boolean;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocialLinksSection: React.FC<SocialSectionProps> = ({
  user,
  isOwner,
  setReloadUser,
}) => {
  const [showSocialForm, setShowSocialForm] = useState(false);
  const { backendUrl } = useContext(AppContext);

  return (
    <div className="profile-section">
      <div className="exp-section">
        <h3 className="profile-section-title">Social Links</h3>
        {isOwner && (
          <>
            {user.linkedinId !== "" && user.githubId !== "" ? (
              <button
                className="add-btn"
                type="button"
                onClick={() => setShowSocialForm(true)}
              >
                <img src={assets.pencil} alt="edit-icon" className="add-icon" />
              </button>
            ) : (
              <button
                className="add-btn"
                onClick={() => setShowSocialForm(true)}
              >
                <img src={assets.add} alt="add-icon" className="add-icon" />
              </button>
            )}
          </>
        )}
      </div>

      {showSocialForm && user && (
        <SocialLinksForm
          user={user}
          backendUrl={backendUrl}
          setReloadUser={setReloadUser}
          setShowSocialForm={setShowSocialForm}
        />
      )}

      <div className="social-links">
        {user.githubId === "" && user.linkedinId === "" ? (
          <p>No social links added yet.</p>
        ) : (
          <>
            {user.githubId && (
              <a href={user.githubId} target="_blank" rel="noopener noreferrer">
                {" "}
                GitHub Profile
              </a>
            )}
            {user.linkedinId && (
              <a
                href={user.linkedinId}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SocialLinksSection;
