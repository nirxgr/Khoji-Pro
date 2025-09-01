import React, { useContext, useEffect, useState } from "react";
import { ISkill } from "../../shared/interfaces/skill.interface";
import { assets } from "../../assets/assets";
import SkillForm from "./SkillForm";
import { IExperience } from "../../shared/interfaces/experience.interface";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

interface SkillSectionProps {
  isOwner: boolean;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  skills: ISkill[];
  experiences: IExperience[];
}

const SkillSection: React.FC<SkillSectionProps> = ({
  isOwner,
  setReloadUser,
  skills,
  experiences,
}) => {
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null);
  const [showEditSkill, setShowEditSkill] = useState(false);
  const [showDeleteSkill, setShowDeleteSkill] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showSkillForm || showEditSkill || showDeleteSkill) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSkillForm, showEditSkill, showDeleteSkill]);

  return (
    <div className="profile-section">
      <div className="exp-section">
        <div className="profile-title-wrapper">
          <div className="icon-wrapper">
            <img src={assets.skills} />
          </div>
          <h3 className="profile-section-title">Skills</h3>
        </div>

        {isOwner && (
          <button
            className="add-btn"
            onClick={() => {
              setShowSkillForm(true);
            }}
          >
            <img src={assets.add} alt="add-icon" className="add-icon" />
          </button>
        )}
      </div>

      {showSkillForm && (
        <div className="profile-form-overlay">
          <div className="profile-form">
            <h2 className="profile-form-title">Add Skills</h2>
            <SkillForm
              type="add"
              setReloadUser={setReloadUser}
              setShowSkillForm={setShowSkillForm}
              experiences={experiences}
              onCancel={() => setShowSkillForm(false)}
            />
          </div>
        </div>
      )}

      <div className="skills-list">
        {skills.length === 0 ? (
          <p className="no-exp">No skills added yet.</p>
        ) : (
          <ul>
            {skills.map((sk) => (
              <li key={sk._id} className="skills-item">
                <div className="experience-details">
                  <h3>{sk.name}</h3>
                  {sk.company && (
                    <p className="extra">Learned at: {sk.company.company}</p>
                  )}
                </div>
                {isOwner && (
                  <div className="skill-actions">
                    <button
                      className="pencil-btn"
                      onClick={() => {
                        setSelectedSkill(sk);
                        setShowEditSkill(true);
                      }}
                    >
                      <img
                        src={assets.pencil}
                        alt="Edit button"
                        className="edit-icon"
                      />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedSkill(sk);
                        setShowDeleteSkill(true);
                      }}
                    >
                      <img
                        src={assets.deleteicon}
                        alt="Delete"
                        className="delete-icon"
                      />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {showEditSkill && selectedSkill && (
          <div className="profile-form-overlay">
            <div className="profile-form">
              <h2 className="profile-form-title">Update Skill</h2>

              <SkillForm
                type="edit"
                initialValues={{
                  ...selectedSkill,
                }}
                setReloadUser={setReloadUser}
                setShowEditSkill={setShowEditSkill}
                experiences={experiences}
                onCancel={() => setShowEditSkill(false)}
              />
            </div>
          </div>
        )}

        {showDeleteSkill && selectedSkill && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Delete skill</h3>
              <p>
                Are you sure you want to delete your "{selectedSkill?.name}"
                skill
                {selectedSkill?.company?.company
                  ? ` learned at "${selectedSkill.company.company}"`
                  : ""}
                ?
              </p>
              <div className="popup-actions">
                <button
                  className="cancel-btn-popup"
                  onClick={() => setShowDeleteSkill(false)}
                >
                  Cancel
                </button>
                <button
                  className="delete-btn-popup"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const { data } = await axios.delete(
                        `${backendUrl}/api/sk/delete-skill/${selectedSkill?._id}`
                      );
                      if (data.success) {
                        setReloadUser(true);
                        setShowDeleteSkill(false);
                        toast.success(data.message);
                      } else {
                        toast.error(data.message);
                      }
                    } catch (err) {
                      console.error("Failed to delete skill:", err);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            {isLoading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillSection;
