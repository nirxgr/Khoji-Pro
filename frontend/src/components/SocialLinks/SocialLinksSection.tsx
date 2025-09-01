import React, { useContext, useEffect, useState } from "react";
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
  useEffect(() => {
    if (showSocialForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSocialForm]);

  return (
    <div className="profile-section">
      <div className="exp-section">
        <div className="profile-title-wrapper">
          <div className="icon-wrapper">
            <img src={assets.social} />
          </div>
          <h3 className="profile-section-title">Social Links</h3>
        </div>

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
          <p className="no-social">No social links added yet.</p>
        ) : (
          <>
            {user.githubId && (
              <a
                href={user.githubId}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div className="social">
                  <div className="social-img">
                    {" "}
                    <img src={assets.github} />
                  </div>
                  <div className="social-content">
                    <div className="social-title">
                      <h2>Github</h2>
                    </div>
                    <div className="social-text">
                      Check out my open source projects and contributions
                    </div>
                  </div>
                </div>
              </a>
            )}
            {user.linkedinId && (
              <a
                href={user.linkedinId}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="social">
                  <div className="social-img">
                    {" "}
                    <img src={assets.linkedin} />
                  </div>
                  <div className="social-content">
                    <div className="social-title">
                      <h2>Linkedin</h2>
                    </div>
                    <div className="social-text">
                      Connect with me professionaly
                    </div>
                  </div>
                </div>
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SocialLinksSection;
