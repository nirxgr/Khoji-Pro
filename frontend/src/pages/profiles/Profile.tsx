import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import "./Profile.css";
import Header from "../../components/Header/Header.js";
import { IUser } from "../../shared/interfaces/user.interface.tsx";
import { IExperience } from "../../shared/interfaces/experience.interface.tsx";
import { IEducation } from "../../shared/interfaces/education.interface.tsx";
import { ISkill } from "../../shared/interfaces/skill.interface.tsx";

import ProfileCover from "../../components/Profile/ProfileCover.tsx";
import ProfilePicture from "../../components/Profile/ProfilePicture.tsx";
import ExperienceSection from "../../components/Experience/ExperienceSection.tsx";
import EducationSection from "../../components/Education/EducationSection.tsx";
import SkillSection from "../../components/Skill/SkillSection.tsx";
import SocialLinksSection from "../../components/SocialLinks/SocialLinksSection.tsx";
import ProfileDetailsSection from "../../components/ProfileDetails/ProfileDetailsSection.tsx";
import ContactDetailsSection from "../../components/ContactDetails/ContactDetailsSection.tsx";

const SearchedProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [reloadUser, setReloadUser] = useState(false);
  const { backendUrl, userData, setUserData, getUserData } =
    useContext(AppContext);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [skills, setSkills] = useState<ISkill[]>([]);
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

          <ProfileDetailsSection
            user={user}
            isOwner={isOwner}
            setReloadUser={setReloadUser}
          />
        </div>

        <ContactDetailsSection
          user={user}
          isOwner={isOwner}
          setReloadUser={setReloadUser}
        />

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
