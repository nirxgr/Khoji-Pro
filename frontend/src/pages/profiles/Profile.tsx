import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import "./Profile.css";
import ProfileDetailsForm from "../../components/ProfileDetails/ProfileDetailsForm.tsx";
import ContactDetailsForm from "../../components/ProfileDetails/ContactDetailsForm.tsx";
import SoicalLinksForm from "../../components/SocialLinks/SocialLinksForm.tsx";
import Header from "../../components/Header/Header.js";
import { assets } from "../../assets/assets.js";
import { toast } from "react-toastify";
import { IUser } from "../../shared/interfaces/user.interface.tsx";
import { IExperience } from "../../shared/interfaces/experience.interface.tsx";
import { IEducation } from "../../shared/interfaces/education.interface.tsx";
import EducationForm from "../../components/Education/EducationForm.tsx";
import { ISkill } from "../../shared/interfaces/skill.interface.tsx";
import SkillForm from "../../components/Skill/SkillForm.tsx";
import ProfileCover from "../../components/Profile/ProfileCover.tsx";
import ProfilePicture from "../../components/Profile/ProfilePicture.tsx";
import ExperienceSection from "../../components/Experience/ExperienceSection.tsx";
import EducationSection from "../../components/Education/EducationSection.tsx";
import SkillSection from "../../components/Skill/SkillSection.tsx";
import SocialLinksSection from "../../components/SocialLinks/SocialLinksSection.tsx";

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
          <ContactDetailsForm
            user={user}
            backendUrl={backendUrl}
            setReloadUser={setReloadUser}
            setShowContactForm={setShowContactForm}
          />
        )}

        <ExperienceSection
          isOwner={isOwner}
          setReloadUser={setReloadUser}
          experiences={experiences}
        />

        <EducationSection
          isOwner={isOwner}
          setReloadUser={setReloadUser}
          educations={educations}
        />

        <SkillSection
          isOwner={isOwner}
          setReloadUser={setReloadUser}
          skills={skills}
          experiences={experiences}
        />

        <SocialLinksSection
          user={user}
          isOwner={isOwner}
          setReloadUser={setReloadUser}
        />
      </div>
    </div>
  );
};

export default SearchedProfilePage;
