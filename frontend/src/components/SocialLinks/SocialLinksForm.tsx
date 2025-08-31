import { useForm } from "react-hook-form";
import { IUser } from "../../shared/interfaces/user.interface.tsx";
import { submitUserProfile } from "../../shared/service/user.service.tsx";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";

interface SocialLinksProps {
  user: IUser;
  backendUrl: string;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSocialForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocialLinksForm: React.FC<SocialLinksProps> = ({
  user,
  backendUrl,
  setReloadUser,
  setShowSocialForm,
}) => {
  const [showDeleteLinkedinId, setShowDeleteLinkedinId] = useState(false);
  const [showDeleteGithubId, setShowDeleteGithubId] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register: registerSocial,
    handleSubmit: handleSocial,
    reset: resetSocial,
    formState: { errors: socialErrors, isSubmitting: isSubmittingSocial },
  } = useForm<IUser>({
    mode: "onSubmit",
    defaultValues: {
      githubId: user?.githubId || "",
      linkedinId: user?.linkedinId || "",
    },
  });

  const handleSocialCancel = () => {
    resetSocial();
    setShowSocialForm(false);
  };

  const onSubmit = async (data: IUser) => {
    await submitUserProfile(data, backendUrl, setReloadUser, setShowSocialForm);
    resetSocial(data);
  };

  return (
    <div className="profile-form-overlay">
      <div className="profile-form">
        {user.githubId && user.linkedinId ? (
          <h2 className="profile-form-title"> Edit Social Links</h2>
        ) : (
          <h2 className="profile-form-title">Add Social Links</h2>
        )}

        <form className="form-group" onSubmit={handleSocial(onSubmit)}>
          <div className="input">
            <label htmlFor="company">GitHub Profile Link</label>
            <div className="link-delete">
              <input
                type="text"
                className="edit-input-field"
                id="company"
                {...registerSocial("githubId")}
              />
              {user.githubId && (
                <button className="delete-link-btn" type="button">
                  <img
                    src={assets.deleteicon}
                    alt="Delete"
                    className="delete-icon"
                    onClick={() => setShowDeleteGithubId(true)}
                  />
                </button>
              )}
            </div>
            {socialErrors.githubId?.message && (
              <p className="profile-error">{socialErrors.githubId.message}</p>
            )}
            {showDeleteGithubId && (
              <div className="popup-overlay">
                <div className="popup">
                  <h3>Delete Github ID Link</h3>
                  <p>Are you sure you want to delete your Github ID Link ?</p>
                  <div className="popup-actions">
                    <button
                      className="cancel-btn-popup"
                      type="button"
                      onClick={() => setShowDeleteGithubId(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="delete-btn-popup"
                      type="button"
                      onClick={async () => {
                        try {
                          setIsDeleting(true);
                          const { data } = await axios.delete(
                            `${backendUrl}/api/user/deleteGithubId`
                          );
                          if (data.success) {
                            resetSocial({ ...user, githubId: "" });
                            setReloadUser(true);
                            setShowDeleteGithubId(false);
                            toast.success(data.message);
                          } else {
                            toast.error(data.message);
                          }
                        } catch (err) {
                          toast.error(err.message);
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                    >
                      Delete
                    </button>
                    {isDeleting && (
                      <div className="loading-overlay">
                        <div className="spinner"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="input">
            <label htmlFor="position">Linkedin Profile Link</label>
            <div className="link-delete">
              <input
                type="text"
                className="edit-input-field"
                id="position"
                {...registerSocial("linkedinId")}
              />
              {user.linkedinId && (
                <button className="delete-link-btn" type="button">
                  <img
                    src={assets.deleteicon}
                    alt="Delete"
                    className="delete-icon"
                    onClick={() => setShowDeleteLinkedinId(true)}
                  />
                </button>
              )}
            </div>

            {socialErrors.linkedinId?.message && (
              <p className="profile-error">{socialErrors.linkedinId.message}</p>
            )}
            {showDeleteLinkedinId && (
              <div className="popup-overlay">
                <div className="popup">
                  <h3>Delete Linkedin ID Link</h3>
                  <p>Are you sure you want to delete your Linkedin ID Link ?</p>
                  <div className="popup-actions">
                    <button
                      className="cancel-btn-popup"
                      type="button"
                      onClick={() => setShowDeleteLinkedinId(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="delete-btn-popup"
                      type="button"
                      onClick={async () => {
                        try {
                          setIsDeleting(true);
                          const { data } = await axios.delete(
                            `${backendUrl}/api/user/deleteLinkedinId`
                          );
                          if (data.success) {
                            resetSocial({ ...user, linkedinId: "" });
                            setReloadUser(true);
                            setShowDeleteLinkedinId(false);
                            toast.success(data.message);
                          } else {
                            toast.error(data.message);
                          }
                        } catch (err) {
                          toast.error(
                            err.response?.data?.message ||
                              err.message ||
                              "Server error"
                          );
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                    >
                      Delete
                    </button>
                    {isDeleting && (
                      <div className="loading-overlay">
                        <div className="spinner"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-save">
              Save
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleSocialCancel}
            >
              Cancel
            </button>
          </div>
        </form>
        {isSubmittingSocial && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLinksForm;
