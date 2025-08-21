import { useParams } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import "./Profile.css";
import ProfileDetails from "../../components/ProfileDetails/ProfileDetails.tsx";
import ContactDetails from "../../components/ProfileDetails/ContactDetails.tsx";
import SoicalLinks from "../../components/ProfileDetails/SocialLinks.tsx";
import Header from "../../components/Header/Header.js";
import { assets } from "../../assets/assets.js";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { IUser } from "../../shared/interfaces/user.interface.tsx";
import { IExperience } from "../../shared/interfaces/experience.interface.tsx";
import ExperienceForm from "../../components/Experience/ExperienceForm.tsx";

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
  const defaultProfilePic =
    "http://res.cloudinary.com/dfuxutqkg/image/upload/v1754820563/wa3j0r4ica4c9jjtyotd.jpg";

  const defaultCoverPic =
    "https://res.cloudinary.com/dfuxutqkg/image/upload/v1755276027/mouum6xu3ftmrcsgo7vp.png";
  const [user, setUser] = useState<IUser | null>(null);
  const [reloadUser, setReloadUser] = useState(false);
  const { backendUrl, userData, setUserData, getUserData } =
    useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const isOwner = userData?._id === id;

  const {
    register: registerAddEdu,
    handleSubmit: handleAddEdu,
    reset: resetAddEdu,
    formState: { errors: addEduErrors, isSubmitting: isSubmittingAddEdu },
  } = useForm<IEducation>({ mode: "onSubmit" });

  const {
    register: registerEditEdu,
    handleSubmit: handleEditEdu,
    reset: resetEditEdu,
    formState: { errors: editEduErrors, isSubmitting: isSubmittingEditEdu },
  } = useForm<IEducation>({ mode: "onSubmit" });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpdateClick = () => {
    fileInputRef.current?.click();
  };
  const handleExit = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  const openCamera = async () => {
    try {
      const s: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(s);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => console.error("Video play error:", err));
        }
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);

      // stop camera after capture
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }, "image/jpeg");
  };

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setOpenProfileEdit(false);
  };

  const handleCoverUploadCancel = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setOpen(false);
  };

  const handleProfilePicSave = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await axios.patch(
        backendUrl + "/api/user/updateProfilePic",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        await getUserData();
        setUserData((prev: any) => ({
          ...prev,
          profilePictureUrl: res.data.image,
        }));
        toast.success(res.data.message);
        setReloadUser(true);
        handleExit();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error uploading profile picture");
    } finally {
      setIsUploading(false);
    }
  };
  const handleCoverPicSave = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await axios.patch(
        backendUrl + "/api/user/updateCoverPic",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setReloadUser(true);
        handleExit();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error uploading cover picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfilePicDelete = async () => {
    try {
      setIsUploading(true);
      const res = await axios.delete(backendUrl + "/api/user/deleteProfilePic");
      if (res.data.success) {
        toast.success(res.data.message);
        setReloadUser(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error deleting profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverPicDelete = async () => {
    try {
      setIsUploading(true);
      const res = await axios.delete(backendUrl + "/api/user/deleteCoverPic");
      if (res.data.success) {
        toast.success(res.data.message);
        setReloadUser(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error deleting cover picture");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const res = await axios.get(`${backendUrl}/api/user/${id}`);
        setUser(res.data);
        // reset(res.data);

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

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.error("Video play error:", err));
      }
    }
  }, [stream]);

  if (!user) return <p>No user found</p>;

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
              src={user.coverPictureUrl.url || defaultCoverPic}
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
              <>
                <div
                  className="overlay"
                  onClick={handleCoverUploadCancel}
                ></div>

                <div className="edit-photo-overlay">
                  <div className="edit-photo-top">
                    <h2 className="edit-photo-title">Edit Cover Picture</h2>
                    <img
                      src={assets.cancel}
                      alt="Cancel Icon"
                      className="cancel-icon"
                      onClick={handleCoverUploadCancel}
                    />
                  </div>
                  <div className="edit-photo-rectangle">
                    {stream ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-preview"
                      />
                    ) : (
                      <img
                        src={
                          previewUrl ||
                          user.coverPictureUrl.url ||
                          defaultCoverPic
                        }
                        alt="Cover Photo"
                      />
                    )}
                  </div>
                  {!selectedFile ? (
                    <div className="edit-photo-buttons">
                      {stream ? (
                        <button
                          className="capture-button"
                          onClick={capturePhoto}
                        >
                          Capture
                        </button>
                      ) : (
                        <>
                          <div className="main-two-buttons">
                            <button
                              className="photo-buttons"
                              onClick={openCamera}
                            >
                              <img
                                src={assets.camera}
                                alt="camera icon"
                                className="delete-picture"
                              />
                            </button>
                            <button
                              className="photo-buttons"
                              onClick={handleUpdateClick}
                            >
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                              />
                            </button>
                          </div>

                          <button
                            className="photo-buttons"
                            onClick={handleCoverPicDelete}
                          >
                            <img
                              src={assets.deleteicon}
                              alt="edit-icon"
                              className="edit-icon"
                            />
                          </button>
                          {isUploading && (
                            <div className="loading-overlay">
                              <div className="spinner"></div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="save-photo-buttons">
                        <button
                          className="save-buttons"
                          onClick={handleCoverPicSave}
                        >
                          Save
                        </button>
                        <button className="save-buttons" onClick={handleExit}>
                          Cancel
                        </button>
                      </div>
                      {isUploading && (
                        <div className="loading-overlay">
                          <div className="spinner"></div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {openProfileEdit && (
            <>
              <div className="overlay" onClick={handleCancel}></div>

              <div className="edit-photo-overlay">
                <div className="edit-photo-top">
                  <h2 className="edit-photo-title">Edit Profile Picture</h2>
                  <img
                    src={assets.cancel}
                    alt="Cancel Icon"
                    className="cancel-icon"
                    onClick={handleCancel}
                  />
                </div>
                <div className="edit-photo-circle">
                  {stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="camera-preview"
                    />
                  ) : (
                    <img
                      src={
                        previewUrl ||
                        user.profilePictureUrl.url ||
                        defaultProfilePic
                      }
                      alt="Profile Photo"
                    />
                  )}
                </div>
                {!selectedFile ? (
                  <div className="edit-photo-buttons">
                    {stream ? (
                      <button
                        className="capture-button"
                        onClick={capturePhoto}
                      ></button>
                    ) : (
                      <>
                        <div className="main-two-buttons">
                          <button
                            className="photo-buttons"
                            onClick={openCamera}
                          >
                            <img
                              src={assets.camera}
                              alt="camera icon"
                              className="delete-picture"
                            />
                          </button>
                          <button
                            className="photo-buttons"
                            onClick={handleUpdateClick}
                          >
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                          </button>
                        </div>

                        <button
                          className="photo-buttons"
                          onClick={handleProfilePicDelete}
                        >
                          <img
                            src={assets.deleteicon}
                            alt="edit-icon"
                            className="edit-icon"
                          />
                        </button>
                        {isUploading && (
                          <div className="loading-overlay">
                            <div className="spinner"></div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="save-photo-buttons">
                      <button
                        className="save-buttons"
                        onClick={handleProfilePicSave}
                      >
                        Save
                      </button>
                      <button className="save-buttons" onClick={handleExit}>
                        Cancel
                      </button>
                    </div>
                    {isUploading && (
                      <div className="loading-overlay">
                        <div className="spinner"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          <div className="profile-picture">
            <img
              src={user.profilePictureUrl.url || defaultProfilePic}
              alt="profile-photo"
              onClick={
                isOwner ? () => setOpenProfileEdit((prev) => !prev) : undefined
              }
            />
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
                  backendUrl={backendUrl}
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
                    backendUrl={backendUrl}
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
                      placeholder="(Optional)"
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
                      placeholder="Write the activites you did here (Optional)."
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
