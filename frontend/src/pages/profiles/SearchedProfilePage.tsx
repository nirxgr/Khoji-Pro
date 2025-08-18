import { useParams } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import "./Profile.css";
import Header from "../../components/Header";
import { assets } from "../../assets/assets.js";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  phoneNumber: string;
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

interface IEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  activities: string;
  _id: string;
}

const SearchedProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [reloadUser, setReloadUser] = useState(false);
  const { backendUrl, userData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

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

  const emptyEducation = {
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
    activities: "",
  };

  const [eduFormData, setEduFormData] = useState(emptyEducation);
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [showEduForm, setShowEduForm] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState<IEducation | null>(null);
  const [showDeleteEdu, setShowDeleteEdu] = useState(false);
  const [showEditEdu, setShowEditEdu] = useState(false);

  const [loading, setLoading] = useState(false);

  const isOwner = userData?._id === id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IUser>({ mode: "onBlur" });

  const {
    register: registerAddExp,
    handleSubmit: handleAddExp,
    reset: resetAddExp,
    formState: { errors: addErrors, isSubmitting: isSubmittingAddExp },
  } = useForm<IExperience>({ mode: "onBlur" });

  const {
    register: registerEditExp,
    handleSubmit: handleEditExp,
    reset: resetEditExp,
    formState: { errors: editErrors, isSubmitting: isSubmittingEditExp },
  } = useForm<IExperience>({ mode: "onBlur" });

  const {
    register: registerAddEdu,
    handleSubmit: handleAddEdu,
    reset: resetAddEdu,
    formState: { errors: addEduErrors, isSubmitting: isSubmittingAddEdu },
  } = useForm<IEducation>({ mode: "onBlur" });

  const {
    register: registerEditEdu,
    handleSubmit: handleEditEdu,
    reset: resetEditEdu,
    formState: { errors: editEduErrors, isSubmitting: isSubmittingEditEdu },
  } = useForm<IEducation>({ mode: "onBlur" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const res = await axios.get(`${backendUrl}/api/user/${id}`);
        setUser(res.data);
        reset(res.data);

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

        setReloadUser(false);
      } catch (err) {
        console.error("Error fetching profile or experiences:", err);
      }
    };

    fetchData();
  }, [id, backendUrl, reloadUser, reset]);

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
          console.log(uploadedImage.url);
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

  const handleProfileSave = async (data: IUser) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await axios.post(
        backendUrl + "/api/update/updateProfileDetails",
        data
      );
      if (res.data.success) {
        setReloadUser(true);
        if (showForm) setShowForm(false);
        if (showContactForm) setShowContactForm(false);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleExpAdd = async (expFormData: IExperience) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await axios.post(
        backendUrl + "/api/exp/add-experience",
        expFormData
      );
      if (res.data.success) {
        setReloadUser(true);
        setShowExpForm(false);
        setExpFormData(emptyExperience);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error adding experience!");
    }
  };

  const handleExpCancel = () => {
    resetAddExp();
    setShowExpForm(false);
  };

  const handleUpdateExperience = async (
    id: string,
    updatedData: IExperience
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
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

  const handleEduAdd = async (eduFormData: IEducation) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await axios.post(
        backendUrl + "/api/edu/add-education",
        eduFormData
      );
      if (res.data.success) {
        setReloadUser(true);
        setShowEduForm(false);
        resetAddEdu();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error adding education!");
    }
  };

  const handleEduCancel = () => {
    setShowEduForm(false);
    resetAddEdu();
  };

  const handleUpdateEducation = async (id: string, updatedData: IEducation) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.put(
        `${backendUrl}/api/edu/update-education/${id}`,
        updatedData
      );

      if (response.data.success) {
        setReloadUser(true);
        setShowEditEdu(false);
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
            {isOwner && (
              <button
                className="edit-icon-btn"
                onClick={() => setOpen((prev) => !prev)}
              >
                <img
                  src={assets.pencil}
                  alt="edit-icon"
                  className="edit-icon"
                />
              </button>
            )}

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

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}

          <div className="profile-picture">
            <img src={user.profilePictureUrl} alt="profile-photo" />
          </div>

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

              {showForm && (
                <div className="profile-form-overlay">
                  <div className="profile-form">
                    <h2 className="profile-form-title">Edit Profile</h2>
                    <p className="profile-form-subtitle">
                      Edit your profile details
                    </p>
                    <form
                      className="form-group"
                      onSubmit={handleSubmit(handleProfileSave)}
                    >
                      <div className="input">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          type="text"
                          className="edit-input-field"
                          id="firstName"
                          {...register("firstName", {
                            required: {
                              value: true,
                              message: "First Name is required.",
                            },
                          })}
                        />
                        {errors.firstName?.message && (
                          <p className="profile-error">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="input">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          type="text"
                          className="edit-input-field"
                          id="lastName"
                          {...register("lastName", {
                            required: {
                              value: true,
                              message: "Last Name is required.",
                            },
                          })}
                        />
                        {errors.lastName?.message && (
                          <p className="profile-error">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                      <div className="input">
                        <label htmlFor="profession">Designation</label>
                        <input
                          type="text"
                          className="edit-input-field"
                          id="profession"
                          {...register("profession", {
                            required: {
                              value: true,
                              message: "Desgination is required.",
                            },
                          })}
                        />
                        {errors.profession?.message && (
                          <p className="profile-error">
                            {errors.profession.message}
                          </p>
                        )}
                      </div>
                      <div className="input">
                        <label htmlFor="location">Location</label>
                        <input
                          type="text"
                          className="edit-input-field"
                          id="location"
                          {...register("location", {
                            required: {
                              value: true,
                              message: "Location is required.",
                            },
                          })}
                        />
                        {errors.location?.message && (
                          <p className="profile-error">
                            {errors.location.message}
                          </p>
                        )}
                      </div>
                      <div className="input">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                          id="bio"
                          {...register("bio", {
                            required: {
                              value: true,
                              message: "Bio is required.",
                            },
                          })}
                        />
                        {errors.bio?.message && (
                          <p className="profile-error">{errors.bio.message}</p>
                        )}
                      </div>
                      <div className="form-buttons">
                        <button type="submit" className="btn-save">
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                    {isSubmitting && (
                      <div className="loading-overlay">
                        {" "}
                        <div className="spinner"></div>{" "}
                      </div>
                    )}
                  </div>
                </div>
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
                <img src={assets.add} alt="add-icon" className="add-icon" />
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
        {showContactForm && (
          <div className="profile-form-overlay">
            <div className="profile-form">
              <h2 className="profile-form-title">Edit Contact</h2>
              <p className="profile-form-subtitle">Edit your contact details</p>
              <form
                className="form-group"
                onSubmit={handleSubmit(handleProfileSave)}
              >
                <div className="input">
                  <label htmlFor="firstName">Phone Number</label>
                  <input
                    type="text"
                    className="edit-input-field"
                    id="phoneNumber"
                    {...register("phoneNumber", {
                      required: {
                        value: true,
                        message: "Phone number is required.",
                      },
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone Number must be exactly 10 digits",
                      },
                    })}
                  />
                  {errors.phoneNumber?.message && (
                    <p className="profile-error">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn-save">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowContactForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {isSubmitting && (
                <div className="loading-overlay">
                  {" "}
                  <div className="spinner"></div>{" "}
                </div>
              )}
            </div>
          </div>
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
                <form
                  className="form-group"
                  onSubmit={handleAddExp(handleExpAdd)}
                >
                  <div className="input">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      id="company"
                      {...registerAddExp("company", {
                        required: {
                          value: true,
                          message: "Company name is required.",
                        },
                      })}
                    />
                    {addErrors.company?.message && (
                      <p className="profile-error">
                        {addErrors.company.message}
                      </p>
                    )}
                  </div>
                  <div className="input">
                    <label htmlFor="position">Position</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      id="position"
                      {...registerAddExp("position", {
                        required: {
                          value: true,
                          message: "Position is required.",
                        },
                      })}
                    />
                    {addErrors.position?.message && (
                      <p className="profile-error">
                        {addErrors.position.message}
                      </p>
                    )}
                  </div>
                  <div className="input">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      id="location"
                      {...registerAddExp("location", {
                        required: {
                          value: true,
                          message: "Location is required.",
                        },
                      })}
                    />
                    {addErrors.location?.message && (
                      <p className="profile-error">
                        {addErrors.location.message}
                      </p>
                    )}
                  </div>
                  <div className="input">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      className="edit-input-field"
                      id="startDate"
                      {...registerAddExp("startDate", {
                        required: {
                          value: true,
                          message: "Start Date is required.",
                        },
                      })}
                    />
                    {addErrors.startDate?.message && (
                      <p className="profile-error">
                        {addErrors.startDate.message}
                      </p>
                    )}
                  </div>
                  <div className="input">
                    <label htmlFor="endDate">End Date</label>

                    <input
                      type="date"
                      className="edit-input-field"
                      id="endDate"
                      {...registerAddExp("endDate")}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="employmentType">Employment Type</label>

                    <select
                      className="edit-input-field"
                      id="employmentType"
                      defaultValue=""
                      {...registerAddExp("employmentType", {
                        required: {
                          value: true,
                          message: "Employment type is required.",
                        },
                      })}
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
                    {addErrors.employmentType?.message && (
                      <p className="profile-error">
                        {addErrors.employmentType.message}
                      </p>
                    )}
                  </div>

                  <div className="input">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      {...registerAddExp("description", {
                        required: {
                          value: true,
                          message: "Description is required.",
                        },
                      })}
                    />
                    {addErrors.description?.message && (
                      <p className="profile-error">
                        {addErrors.description.message}
                      </p>
                    )}
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
                {isSubmittingAddExp && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
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
                        <button className="pencil-btn">
                          <img
                            src={assets.pencil}
                            alt="Edit button"
                            className="edit-icon"
                            onClick={() => {
                              setSelectedExp(exp);
                              resetEditExp({
                                ...exp,
                                startDate: exp.startDate
                                  ? exp.startDate.split("T")[0]
                                  : "",
                                endDate: exp.endDate
                                  ? exp.endDate.split("T")[0]
                                  : "",
                              });
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
                    )}
                  </li>
                ))}
              </ul>
            )}
            {showEditPopup && selectedExp && (
              <div className="profile-form-overlay">
                <div className="profile-form">
                  <h2 className="profile-form-title">Update Experience</h2>

                  <form
                    onSubmit={handleEditExp((data) =>
                      handleUpdateExperience(selectedExp._id, data)
                    )}
                  >
                    <div className="input">
                      <label htmlFor="company">Company</label>
                      <input
                        type="text"
                        id="company"
                        className="edit-input-field"
                        {...registerEditExp("company", {
                          required: {
                            value: true,
                            message: "Company name is required.",
                          },
                        })}
                      />
                      {editErrors.company?.message && (
                        <p className="profile-error">
                          {editErrors.company.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="position">Position</label>
                      <input
                        type="text"
                        id="position"
                        className="edit-input-field"
                        {...registerEditExp("position", {
                          required: {
                            value: true,
                            message: "Position is required.",
                          },
                        })}
                      />
                      {editErrors.position?.message && (
                        <p className="profile-error">
                          {editErrors.position.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        {...registerEditExp("location", {
                          required: {
                            value: true,
                            message: "Location is required.",
                          },
                        })}
                        className="edit-input-field"
                      />
                      {editErrors.location?.message && (
                        <p className="profile-error">
                          {editErrors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="date"
                        className="edit-input-field"
                        {...registerEditExp("startDate", {
                          required: {
                            value: true,
                            message: "Start Date is required.",
                          },
                        })}
                      />
                      {editErrors.startDate?.message && (
                        <p className="profile-error">
                          {editErrors.startDate.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="date"
                        className="edit-input-field"
                        {...registerEditExp("endDate")}
                      />
                    </div>

                    <div className="input">
                      <label htmlFor="employmentType">Employment Type</label>
                      <select
                        id="employmentType"
                        className="edit-input-field"
                        {...registerEditExp("employmentType", {
                          required: {
                            value: true,
                            message: "Employment Type is required.",
                          },
                        })}
                      >
                        <option value="" disabled>
                          Select Employment Type
                        </option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                      {editErrors.employmentType?.message && (
                        <p className="profile-error">
                          {editErrors.employmentType.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        {...registerEditExp("description", {
                          required: {
                            value: true,
                            message: "Description  is required.",
                          },
                        })}
                        className="edit-input-field"
                      />
                      {editErrors.description?.message && (
                        <p className="profile-error">
                          {editErrors.description.message}
                        </p>
                      )}
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
                  {isSubmittingEditExp && (
                    <div className="loading-overlay">
                      <div className="spinner"></div>
                    </div>
                  )}
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
                <form
                  className="form-group"
                  onSubmit={handleAddEdu(handleEduAdd)}
                >
                  <div className="input">
                    <label htmlFor="school">School</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      id="school"
                      {...registerAddEdu("school", {
                        required: {
                          value: true,
                          message: "School name is required.",
                        },
                      })}
                    />
                    {addEduErrors.school?.message && (
                      <p className="profile-error">
                        {addEduErrors.school.message}
                      </p>
                    )}
                  </div>
                  <div className="input">
                    <label htmlFor="degree">Degree</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      id="degree"
                      {...registerAddEdu("degree", {
                        required: {
                          value: true,
                          message: "Degree name is required.",
                        },
                      })}
                    />
                    {addEduErrors.degree?.message && (
                      <p className="profile-error">
                        {addEduErrors.degree.message}
                      </p>
                    )}
                  </div>
                  <div className="input">
                    <label htmlFor="fieldOfStudy">Field of Study</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      id="fieldOfStudy"
                      {...registerAddEdu("fieldOfStudy", {
                        required: {
                          value: true,
                          message: "Field of Study is required.",
                        },
                      })}
                    />
                    {addEduErrors.fieldOfStudy?.message && (
                      <p className="profile-error">
                        {addEduErrors.fieldOfStudy.message}
                      </p>
                    )}
                  </div>
                  <div className="input">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      className="edit-input-field"
                      id="startDate"
                      {...registerAddEdu("startDate", {
                        required: {
                          value: true,
                          message: "Start Date is required.",
                        },
                      })}
                    />
                    {addEduErrors.startDate?.message && (
                      <p className="profile-error">
                        {addEduErrors.startDate.message}
                      </p>
                    )}
                  </div>
                  <div className="input">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      className="edit-input-field"
                      id="endDate"
                      {...registerAddEdu("endDate", {
                        required: {
                          value: true,
                          message: "End Date is required.",
                        },
                      })}
                    />
                    {addEduErrors.endDate?.message && (
                      <p className="profile-error">
                        {addEduErrors.endDate.message}
                      </p>
                    )}
                  </div>

                  <div className="input">
                    <label htmlFor="grade">Grade</label>
                    <input
                      type="text"
                      className="edit-input-field"
                      id="grade"
                      {...registerAddEdu("grade")}
                    />
                    {addEduErrors.grade?.message && (
                      <p className="profile-error">
                        {addEduErrors.grade.message}
                      </p>
                    )}
                  </div>

                  <div className="input">
                    <label htmlFor="activities">Activities</label>
                    <textarea
                      id="activities"
                      {...registerAddEdu("activities")}
                    />
                    {addEduErrors.activities?.message && (
                      <p className="profile-error">
                        {addEduErrors.activities.message}
                      </p>
                    )}
                  </div>
                  <div className="form-buttons">
                    <button type="submit" className="btn-save">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleEduCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                {isSubmittingAddEdu && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
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
                        <button className="pencil-btn">
                          <img
                            src={assets.pencil}
                            alt="Edit button"
                            className="edit-icon"
                            onClick={() => {
                              setSelectedEdu(edu);
                              resetEditEdu({
                                ...edu,
                                startDate: edu.startDate
                                  ? edu.startDate.split("T")[0]
                                  : "",
                                endDate: edu.endDate
                                  ? edu.endDate.split("T")[0]
                                  : "",
                              });
                              setShowEditEdu(true);
                            }}
                          />
                        </button>

                        <button className="delete-btn">
                          <img
                            src={assets.deleteicon}
                            alt="Delete"
                            className="delete-icon"
                            onClick={() => {
                              setSelectedEdu(edu);
                              setShowDeleteEdu(true);
                            }}
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

                  <form
                    className="form-group"
                    onSubmit={handleEditEdu((data) =>
                      handleUpdateEducation(selectedEdu._id, data)
                    )}
                  >
                    <div className="input">
                      <label htmlFor="school">School</label>
                      <input
                        type="text"
                        id="school"
                        className="edit-input-field"
                        {...registerEditEdu("school", {
                          required: {
                            value: true,
                            message: "School name is required.",
                          },
                        })}
                      />
                      {editEduErrors.school?.message && (
                        <p className="profile-error">
                          {editEduErrors.school.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="degree">Degree</label>
                      <input
                        type="text"
                        id="degree"
                        className="edit-input-field"
                        {...registerEditEdu("degree", {
                          required: {
                            value: true,
                            message: "Degree name is required.",
                          },
                        })}
                      />
                      {editEduErrors.degree?.message && (
                        <p className="profile-error">
                          {editEduErrors.degree.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="fieldOfStudy">Field of Study</label>
                      <input
                        type="text"
                        id="fieldOfStudy"
                        className="edit-input-field"
                        {...registerEditEdu("fieldOfStudy", {
                          required: {
                            value: true,
                            message: "Field of Study is required.",
                          },
                        })}
                      />
                      {editEduErrors.fieldOfStudy?.message && (
                        <p className="profile-error">
                          {editEduErrors.fieldOfStudy.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="date"
                        className="edit-input-field"
                        {...registerEditEdu("startDate", {
                          required: {
                            value: true,
                            message: "Start Date is required.",
                          },
                        })}
                      />
                      {editEduErrors.startDate?.message && (
                        <p className="profile-error">
                          {editEduErrors.startDate.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="date"
                        className="edit-input-field"
                        {...registerEditEdu("endDate", {
                          required: {
                            value: true,
                            message: "End Date is required.",
                          },
                        })}
                      />
                      {editEduErrors.endDate?.message && (
                        <p className="profile-error">
                          {editEduErrors.endDate.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="grade">Grade</label>
                      <input
                        type="text"
                        id="grade"
                        className="edit-input-field"
                        {...registerEditEdu("grade")}
                      />
                      {editEduErrors.grade?.message && (
                        <p className="profile-error">
                          {editEduErrors.grade.message}
                        </p>
                      )}
                    </div>

                    <div className="input">
                      <label htmlFor="activities">Activities</label>
                      <textarea
                        id="activities"
                        className="edit-input-field"
                        {...registerEditEdu("activities")}
                      />
                      {editEduErrors.activities?.message && (
                        <p className="profile-error">
                          {editEduErrors.activities.message}
                        </p>
                      )}
                    </div>

                    <div className="form-buttons">
                      <button type="submit" className="btn-save">
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setShowEditEdu(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                  {isSubmittingEditEdu && (
                    <div className="loading-overlay">
                      <div className="spinner"></div>
                    </div>
                  )}
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
