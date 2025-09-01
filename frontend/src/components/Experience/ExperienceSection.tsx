import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import ExperienceForm from "../../components/Experience/ExperienceForm.tsx";
import { IExperience } from "../../shared/interfaces/experience.interface.tsx";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

interface ExperienceSectionProps {
  isOwner: boolean;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  experiences: IExperience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  isOwner,
  setReloadUser,
  experiences,
}) => {
  const [showExpForm, setShowExpForm] = useState(false);
  const [selectedExp, setSelectedExp] = useState<IExperience | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (showExpForm || showEditPopup || showDeletePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showExpForm, showEditPopup, showDeletePopup]);

  return (
    <div className="profile-section">
      <div className="exp-section">
        <div className="profile-title-wrapper">
          <div className="icon-wrapper">
            <img src={assets.exp} />
          </div>
          <h3 className="profile-section-title">Experience</h3>
        </div>

        {isOwner && (
          <button
            className="add-btn"
            onClick={() => {
              setShowExpForm(true);
            }}
          >
            <img src={assets.add} alt="add-icon" className="add-icon" />
          </button>
        )}
      </div>

      {showExpForm && (
        <div className="profile-form-overlay">
          <div className="profile-form">
            <h2 className="profile-form-title">Add Experience</h2>
            <ExperienceForm
              type="add"
              setReloadUser={setReloadUser}
              setShowExpForm={setShowExpForm}
              setShowEditPopup={setShowEditPopup}
              onCancel={() => setShowExpForm(false)}
            />
          </div>
        </div>
      )}
      <div className="experience-list">
        {experiences.length === 0 ? (
          <p className="no-exp">No experiences added yet.</p>
        ) : (
          <ul>
            {experiences.map((exp) => (
              <li key={exp._id} className="experience-item">
                <div className="experience-details">
                  <h3>{exp.position}</h3>
                  <p className="exp-name">{exp.company}</p>
                  <p className="extra">
                    {exp.location} - {exp.employmentType}
                  </p>

                  <p className="extra">
                    {new Date(exp.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                    {" - "}
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Present"}
                  </p>
                  {exp.description && (
                    <p className="extra">{exp.description}</p>
                  )}
                </div>
                {isOwner && (
                  <div className="experience-actions">
                    <button
                      className="pencil-btn"
                      onClick={() => {
                        setSelectedExp(exp);
                        setShowEditPopup(true);
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
                        setSelectedExp(exp);
                        setShowDeletePopup(true);
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
        {showEditPopup && selectedExp && (
          <div className="profile-form-overlay">
            <div className="profile-form">
              <h2 className="profile-form-title">Update Experience</h2>

              <ExperienceForm
                type="edit"
                initialValues={{
                  ...selectedExp,
                  startDate: selectedExp.startDate
                    ? selectedExp.startDate.split("T")[0]
                    : "",
                  endDate: selectedExp.endDate
                    ? selectedExp.endDate.split("T")[0]
                    : "",
                }}
                setReloadUser={setReloadUser}
                setShowEditPopup={setShowEditPopup}
                setShowExpForm={setShowExpForm}
                onCancel={() => setShowEditPopup(false)}
              />
            </div>
          </div>
        )}

        {showDeletePopup && selectedExp && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Delete experience</h3>
              <p>
                Are you sure you want to delete your "{selectedExp.company}"
                experience?
              </p>
              <div className="popup-actions">
                <button
                  className="cancel-btn-popup"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="delete-btn-popup"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const { data } = await axios.delete(
                        `${backendUrl}/api/exp/delete-experience/${selectedExp._id}`
                      );
                      if (data.success) {
                        setReloadUser(true);
                        setShowDeletePopup(false);
                        toast.success(data.message);
                      } else {
                        toast.error(data.message);
                      }
                    } catch (err) {
                      console.error("Failed to delete experience:", err);
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

export default ExperienceSection;
