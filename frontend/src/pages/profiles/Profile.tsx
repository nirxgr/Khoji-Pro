import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import "./Profile.css";
import ProfileDetails from "../../components/ProfileDetails/ProfileDetails.tsx";
import ContactDetails from "../../components/ProfileDetails/ContactDetails.tsx";
import SoicalLinks from "../../components/ProfileDetails/SocialLinks.tsx";
import Header from "../../components/Header/Header.js";
import { assets } from "../../assets/assets.js";
import { toast } from "react-toastify";
import { IUser } from "../../shared/interfaces/user.interface.tsx";
import { IExperience } from "../../shared/interfaces/experience.interface.tsx";
import { IEducation } from "../../shared/interfaces/education.interface.tsx";
import ExperienceForm from "../../components/Experience/ExperienceForm.tsx";
import EducationForm from "../../components/Education/EducationForm.tsx";
import { ISkill } from "../../shared/interfaces/skill.interface.tsx";
import SkillForm from "../../components/Skill/SkillForm.tsx";
import ProfileCover from "../../components/Profile/ProfileCover.tsx";
import ProfilePicture from "../../components/Profile/ProfilePicture.tsx";

const SearchedProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [reloadUser, setReloadUser] = useState(false);
  const { backendUrl, userData, setUserData, getUserData } =
    useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);

  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedExp, setSelectedExp] = useState<IExperience | null>(null);

  const [educations, setEducations] = useState<IEducation[]>([]);
  const [showEduForm, setShowEduForm] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState<IEducation | null>(null);
  const [showDeleteEdu, setShowDeleteEdu] = useState(false);
  const [showEditEdu, setShowEditEdu] = useState(false);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null);
  const [showDeleteSkill, setShowDeleteSkill] = useState(false);
  const [showEditSkill, setShowEditSkill] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOwner = userData?._id === id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const res = await axios.get(`${backendUrl}/api/user/${id}`);
        setUser(res.data);

        // Fetch user experiences
        const expRes = await axios.get(
          `${backendUrl}/api/exp/get-experience/${id}`
        );
        setExperiences(expRes.data || []);

        // Fetch user educations
        const eduRes = await axios.get(
          `${backendUrl}/api/edu/get-education/${id}`
        );
        setEducations(eduRes.data || []);

        const skillRes = await axios.get(
          `${backendUrl}/api/sk/get-skill/${id}`
        );
        setSkills(skillRes.data || []);
        console.log(skillRes.data);

        setReloadUser(false);
      } catch (err) {
        console.error("Error fetching profile or experiences:", err);
      }
    };

    fetchData();
  }, [id, backendUrl, reloadUser]);

  if (!user) return <p>No user found</p>;

  return (
    <div className="main">
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <ProfileCover
            user={user}
            isOwner={isOwner}
            setReloadUser={setReloadUser}
          />

          <ProfilePicture
            user={user}
            isOwner={isOwner}
            setReloadUser={setReloadUser}
            getUserData={getUserData}
            setUserData={setUserData}
          />

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
                  <img
                    src={assets.pencil}
                    alt="edit-icon"
                    className="edit-icon"
                  />
                </button>
              )}

              {showForm && user && (
                <ProfileDetails
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
        </div>
        <div className="profile-section">
          <div className="exp-section">
            <h3 className="profile-section-title">Contact Information</h3>
            {isOwner && (
              <button
                className="add-btn"
                onClick={() => {
                  setShowContactForm(true);
                }}
              >
                <img src={assets.pencil} alt="add-icon" className="add-icon" />
              </button>
            )}
          </div>
          <div className="contact-details">
            <p className="location">
              <img
                src={assets.mail2}
                alt="mail icon"
                className="location-icon"
              />
              {user.email || "---"}
            </p>
            <p className="location">
              <img
                src={assets.phone2}
                alt="mail icon"
                className="location-icon"
              />
              {user.phoneNumber || "---"}
            </p>
          </div>
        </div>
        {showContactForm && user && (
          <ContactDetails
            user={user}
            backendUrl={backendUrl}
            setReloadUser={setReloadUser}
            setShowContactForm={setShowContactForm}
          />
        )}

        <div className="profile-section">
          <div className="exp-section">
            <h3 className="profile-section-title">Experience</h3>
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
              <p>No experiences added yet.</p>
            ) : (
              <ul>
                {experiences.map((exp) => (
                  <li key={exp._id} className="experience-item">
                    <div className="experience-details">
                      <h3>{exp.position}</h3>
                      <p>
                        {exp.company} - {exp.location} - {exp.employmentType}
                      </p>
                      <p>
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
                      {exp.description && <p>{exp.description}</p>}
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
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <div className="exp-section">
            <h3 className="profile-section-title">Education</h3>
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
              <p>No education added yet.</p>
            ) : (
              <ul>
                {educations.map((edu) => (
                  <li key={edu._id} className="experience-item">
                    <div className="experience-details">
                      <h3>{edu.school}</h3>
                      <p>
                        {edu.degree} - {edu.fieldOfStudy}
                      </p>
                      <p>
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
                      {edu.grade && <p>Grade: {edu.grade}</p>}
                      {edu.activities && <p>{edu.activities}</p>}
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
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <div className="exp-section">
            <h3 className="profile-section-title">Skills</h3>
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
                <h2 className="profile-form-title">Add Education</h2>
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

          <div className="experience-list">
            {skills.length === 0 ? (
              <p>No skills added yet.</p>
            ) : (
              <ul>
                {skills.map((sk) => (
                  <li key={sk._id} className="experience-item">
                    <div className="experience-details">
                      <h3>{sk.name}</h3>
                      {sk.company && <p>Learned at: {sk.company.company}</p>}
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
                          await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                          );
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

        <div className="profile-section">
          <div className="exp-section">
            <h3 className="profile-section-title">Social</h3>
            {isOwner && (
              <>
                {user.linkedinId !== "" && user.githubId !== "" ? (
                  <button
                    className="add-btn"
                    type="button"
                    onClick={() => setShowSocialForm(true)}
                  >
                    <img
                      src={assets.pencil}
                      alt="edit-icon"
                      className="add-icon"
                    />
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
            <SoicalLinks
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
                  <a
                    href={user.githubId}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
      </div>
    </div>
  );
};

export default SearchedProfilePage;
