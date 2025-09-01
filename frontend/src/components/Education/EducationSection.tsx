import React, { useContext, useEffect, useState } from "react";
import { IEducation } from "../../shared/interfaces/education.interface";
import { assets } from "../../assets/assets";
import EducationForm from "./EducationForm";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

interface EducationSectionProps {
  isOwner: boolean;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  educations: IEducation[];
}

const EducationSection: React.FC<EducationSectionProps> = ({
  isOwner,
  setReloadUser,
  educations,
}) => {
  const [showEduForm, setShowEduForm] = useState(false);
  const [showEditEdu, setShowEditEdu] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState<IEducation | null>(null);
  const [showDeleteEdu, setShowDeleteEdu] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (showEduForm || showEditEdu || showDeleteEdu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showEduForm, showEditEdu, showDeleteEdu]);
  return (
    <div className="profile-section">
      <div className="exp-section">
        <div className="profile-title-wrapper">
          <div className="icon-wrapper">
            <img src={assets.edu} />
          </div>
          <h3 className="profile-section-title">Education</h3>
        </div>

        {isOwner && (
          <button
            className="add-btn"
            onClick={() => {
              setShowEduForm(true);
            }}
          >
            <img src={assets.add} alt="add-icon" className="add-icon" />
          </button>
        )}
      </div>

      {showEduForm && (
        <div className="profile-form-overlay">
          <div className="profile-form">
            <h2 className="profile-form-title">Add Education</h2>
            <EducationForm
              type="add"
              setReloadUser={setReloadUser}
              setShowEduForm={setShowEduForm}
              setShowEditEdu={setShowEditEdu}
              onCancel={() => setShowEduForm(false)}
            />
          </div>
        </div>
      )}
      <div className="experience-list">
        {educations.length === 0 ? (
          <p className="no-exp">No education added yet.</p>
        ) : (
          <ul>
            {educations.map((edu) => (
              <li key={edu._id} className="experience-item">
                <div className="experience-details">
                  <h3>{edu.school}</h3>
                  <p className="exp-name">
                    {edu.degree} - {edu.fieldOfStudy}
                  </p>
                  <p className="extra">
                    {new Date(edu.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                    {" - "}
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Present"}
                  </p>
                  {edu.grade && <p className="extra">Grade: {edu.grade}</p>}
                  {edu.activities && <p className="extra">{edu.activities}</p>}
                </div>
                {isOwner && (
                  <div className="experience-actions">
                    <button
                      className="pencil-btn"
                      onClick={() => {
                        setSelectedEdu(edu);
                        setShowEditEdu(true);
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
                        setSelectedEdu(edu);
                        setShowDeleteEdu(true);
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

        {showEditEdu && selectedEdu && (
          <div className="profile-form-overlay">
            <div className="profile-form">
              <h2 className="profile-form-title">Update Education</h2>

              <EducationForm
                type="edit"
                setReloadUser={setReloadUser}
                setShowEduForm={setShowEduForm}
                setShowEditEdu={setShowEditEdu}
                initialValues={{
                  ...selectedEdu,
                  startDate: selectedEdu.startDate
                    ? selectedEdu.startDate.split("T")[0]
                    : "",
                  endDate: selectedEdu.endDate
                    ? selectedEdu.endDate.split("T")[0]
                    : "",
                }}
                onCancel={() => setShowEditEdu(false)}
              />
            </div>
          </div>
        )}

        {showDeleteEdu && selectedEdu && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Delete education</h3>
              <p>
                Are you sure you want to delete your "{selectedEdu.school}"
                education?
              </p>
              <div className="popup-actions">
                <button
                  className="cancel-btn-popup"
                  onClick={() => setShowDeleteEdu(false)}
                >
                  Cancel
                </button>
                <button
                  className="delete-btn-popup"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const { data } = await axios.delete(
                        `${backendUrl}/api/edu/delete-education/${selectedEdu._id}`
                      );
                      if (data.success) {
                        setReloadUser(true);
                        setShowDeleteEdu(false);
                        toast.success(data.message);
                      } else {
                        toast.error(data.message);
                      }
                    } catch (err) {
                      console.error("Failed to delete education:", err);
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

export default EducationSection;
