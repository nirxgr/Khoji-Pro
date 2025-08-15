import { useParams } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import "./Profile.css";
import Header from "../../components/Header";
import { assets } from "../../assets/assets.js";
import { toast } from "react-toastify";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  experienceYears: number;
  profession: string;
  skills: string[];
  location: string;
  linkedid: string;
  github: string;
  languages: string[];
  coverPictureUrl: string;
  profilePictureUrl: string;
}

interface IExperience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  employmentType: string;
  _id: string;
}

const SearchedProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [reloadUser, setReloadUser] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<IUser | null>(null);

  const emptyExperience = {
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    employmentType: "",
  };

  const [expFormData, setExpFormData] = useState(emptyExperience);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedExp, setSelectedExp] = useState<IExperience | null>(null);

  const [loading, setLoading] = useState(false);

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

        setReloadUser(false);
      } catch (err) {
        console.error("Error fetching profile or experiences:", err);
      }
    };

    fetchData();
  }, [id, backendUrl, reloadUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!user) return <p>No user found</p>;

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "khojipro");
    data.append("cloud_name", "dfuxutqkg");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfuxutqkg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();
      try {
        const endpoint =
          type === "profile"
            ? "/api/update/updateProfilePic"
            : "/api/update/updateCoverPic";

        const { data } = await axios.post(backendUrl + endpoint, {
          imageUrl: uploadedImage.url,
        });

        if (data.success) {
          setReloadUser(true);
          setOpen(false);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/update/updateProfileDetails",
        formData
      );
      if (data.success) {
        setReloadUser(true);
        setFormData(null);
        setShowForm(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleProfileCancel = () => {
    setShowForm(false);
    setFormData(null);
  };

  const handleExpChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setExpFormData({ ...expFormData, [name]: value });
  };

  const handleExpAdd = async (e) => {
    e.preventDefault();
    if (!expFormData) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/exp/add-experience",
        expFormData
      );
      if (data.success) {
        setReloadUser(true);
        setShowExpForm(false);
        setExpFormData(emptyExperience);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding experience");
    }
  };

  const handleExpCancel = () => {
    setShowExpForm(false);
    setExpFormData(emptyExperience);
  };

  const handleUpdateExperience = async (
    id: string,
    updatedData: IExperience
  ) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/exp/update-experience/${id}`,
        updatedData
      );

      if (response.data.success) {
        setReloadUser(true);
        setShowEditPopup(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="main">
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <div className="cover-container" ref={containerRef}>
            <img
              src={user.coverPictureUrl}
              alt="cover-photo"
              className="cover-photo"
            />

            <button
              className="edit-icon-btn"
              onClick={() => setOpen((prev) => !prev)}
            >
              <img src={assets.pencil} alt="edit-icon" className="edit-icon" />
            </button>

            {open && (
              <div className="photo-dropdown">
                <div className="photo-element" onClick={handleProfileClick}>
                  Edit Profile Picture
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={profileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e, "profile")}
                />

                <div className="photo-element" onClick={handleCoverClick}>
                  Edit Cover Picture
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e, "cover")}
                />
              </div>
            )}
          </div>

          {loading && <div className="loading-spinner"></div>}

          <div className="profile-picture">
            <img src={user.profilePictureUrl} alt="profile-photo" />
          </div>

          <div className="profile-section-first">
            <div className="profile-name">
              <h1>
                {user?.firstName || "---"} {user.lastName || "---"}
              </h1>
              <button
                className="edit-btn"
                onClick={() => {
                  if (user) setFormData(user);
                  setShowForm(true);
                }}
              >
                <img
                  src={assets.pencil}
                  alt="edit-icon"
                  className="edit-icon"
                />
              </button>
              {showForm && (
                <div className="profile-form-overlay">
                  <div className="profile-form">
                    <h2 className="profile-form-title">Edit Profile</h2>
                    <p className="profile-form-subtitle">
                      Edit your profile details
                    </p>
                    <form onSubmit={handleProfileSave}>
                      <div className="input">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          type="text"
                          className="edit-input-field"
                          id="firstName"
                          name="firstName"
                          value={formData?.firstName || ""}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="input">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          type="text"
                          className="edit-input-field"
                          id="lastName"
                          name="lastName"
                          value={formData?.lastName}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="input">
                        <label htmlFor="profession">Designation</label>
                        <input
                          type="text"
                          className="edit-input-field"
                          id="profession"
                          name="profession"
                          value={formData?.profession}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="input">
                        <label htmlFor="location">Location</label>
                        <input
                          type="text"
                          className="edit-input-field"
                          id="location"
                          name="location"
                          value={formData?.location}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="input">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={formData?.bio}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="form-buttons">
                        <button type="submit" className="btn-save">
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={handleProfileCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <p className="profession">{user.profession || "---"}</p>
              <p className="email">{user.email || "---"}</p>
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
            <h3 className="profile-section-title">Experience</h3>
            <button
              className="add-btn"
              onClick={() => {
                setShowExpForm(true);
              }}
            >
              <img src={assets.add} alt="add-icon" className="add-icon" />
            </button>
          </div>

          {showExpForm && (
            <div className="profile-form-overlay">
              <div className="profile-form">
                <h2 className="profile-form-title">Add Experience</h2>
                <form onSubmit={handleExpAdd}>
                  <div className="input">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      name="company"
                      id="company"
                      onChange={handleExpChange}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="position">Position</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      name="position"
                      id="position"
                      onChange={handleExpChange}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      name="location"
                      id="location"
                      onChange={handleExpChange}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      className="edit-input-field"
                      name="startDate"
                      id="startDate"
                      onChange={handleExpChange}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="endDate">End Date</label>

                    <input
                      type="date"
                      className="edit-input-field"
                      name="endDate"
                      id="endDate"
                      onChange={handleExpChange}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="employmentType">Employment Type</label>

                    <select
                      className="edit-input-field"
                      name="employmentType"
                      id="employmentType"
                      onChange={handleExpChange}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div className="input">
                    <label htmlFor="description">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      onChange={handleExpChange}
                    />
                  </div>
                  <div className="form-buttons">
                    <button type="submit" className="btn-save">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleExpCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
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
                        {new Date(exp.startDate).toLocaleDateString()}
                        {" - "}
                        {exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString()
                          : "Present"}
                      </p>
                      {exp.description && <p>{exp.description}</p>}
                    </div>

                    <div className="experience-actions">
                      <button className="pencil-btn">
                        <img
                          src={assets.pencil}
                          alt="Edit button"
                          className="edit-icon"
                          onClick={() => {
                            setSelectedExp(exp);
                            setShowEditPopup(true);
                          }}
                        />
                      </button>

                      <button className="delete-btn">
                        <img
                          src={assets.deleteicon}
                          alt="Delete"
                          className="delete-icon"
                          onClick={() => {
                            setSelectedExp(exp);
                            setShowDeletePopup(true);
                          }}
                        />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {showEditPopup && selectedExp && (
              <div className="profile-form-overlay">
                <div className="profile-form">
                  <h2 className="profile-form-title">Update Experience</h2>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await handleUpdateExperience(
                        selectedExp._id,
                        selectedExp
                      );
                    }}
                  >
                    <div className="input">
                      <label htmlFor="company">Company</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={selectedExp.company}
                        onChange={(e) =>
                          setSelectedExp({
                            ...selectedExp,
                            company: e.target.value,
                          })
                        }
                        placeholder="Company"
                        className="edit-input-field"
                        required
                      />
                    </div>

                    <div className="input">
                      <label htmlFor="position">Position</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={selectedExp.position}
                        onChange={(e) =>
                          setSelectedExp({
                            ...selectedExp,
                            position: e.target.value,
                          })
                        }
                        placeholder="Position"
                        className="edit-input-field"
                      />
                    </div>

                    <div className="input">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={selectedExp.location}
                        onChange={(e) =>
                          setSelectedExp({
                            ...selectedExp,
                            location: e.target.value,
                          })
                        }
                        placeholder="Location"
                        className="edit-input-field"
                      />
                    </div>

                    <div className="input">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="date"
                        value={selectedExp.startDate?.split("T")[0]}
                        onChange={(e) =>
                          setSelectedExp({
                            ...selectedExp,
                            startDate: e.target.value,
                          })
                        }
                        className="edit-input-field"
                      />
                    </div>

                    <div className="input">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="date"
                        value={
                          selectedExp.endDate
                            ? selectedExp.endDate.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setSelectedExp({
                            ...selectedExp,
                            endDate: e.target.value,
                          })
                        }
                        className="edit-input-field"
                      />
                    </div>

                    <div className="input">
                      <label htmlFor="employmentType">Employment Type</label>
                      <select
                        value={selectedExp.employmentType}
                        id="employmentType"
                        name="employmentType"
                        onChange={(e) =>
                          setSelectedExp({
                            ...selectedExp,
                            employmentType: e.target.value,
                          })
                        }
                        className="edit-input-field"
                      >
                        <option value="">Select Employment Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div className="input">
                      <label htmlFor="description">Description</label>
                      <textarea
                        value={selectedExp.description || ""}
                        id="description"
                        name="description"
                        onChange={(e) =>
                          setSelectedExp({
                            ...selectedExp,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description"
                        className="edit-input-field"
                      />
                    </div>

                    <div className="form-buttons">
                      <button type="submit" className="btn-save">
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setShowEditPopup(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
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
          <h3 className="profile-section-title">Professional Info</h3>
          <div className="profile-info-grid">
            <p>
              <strong>Profession:</strong> {user.profession || "---"}{" "}
            </p>
            <p>
              <strong>Experience:</strong> {user.experienceYears || "---"} years
            </p>
            <p>
              <strong>Languages:</strong>{" "}
              {user.languages?.length ? user.languages.join(", ") : "---"}{" "}
            </p>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Skills</h3>
          <div className="profile-skills">
            {user.skills?.length ? (
              user.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))
            ) : (
              <span className="skill-tag">---</span>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Social</h3>
          <div className="social-links">
            <a
              href={user.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              GitHub Profile
            </a>
            <a
              href={user.linkedid || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchedProfilePage;
