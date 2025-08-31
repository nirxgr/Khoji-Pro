import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { CameraCapture } from "../Camera/CameraCapture.tsx";
import { IUser } from "../../shared/interfaces/user.interface.tsx";

interface ProfilePictureProps {
  user: IUser;
  isOwner: boolean;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  getUserData: () => void;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}
const ProfilePicture: React.FC<ProfilePictureProps> = ({
  user,
  isOwner,
  setReloadUser,
  getUserData,
  setUserData,
}) => {
  const { videoRef, openCamera, capturePhoto, stream, setStream } =
    CameraCapture({
      onCapture: (file, preview) => {
        setSelectedFile(file);
        setPreviewUrl(preview);
      },
    });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  useEffect(() => {
    if (openProfileEdit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openProfileEdit]);

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setOpenProfileEdit(false);
  };

  const handleUpdateClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPG, JPEG, or PNG images are allowed");
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleExit = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
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
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error uploading cover picture");
      }
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
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error deleting profile picture");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="profile-picture">
        <img
          src={user.profilePictureUrl.url || assets.defaultprofilepic}
          alt="profile-photo"
          onClick={
            isOwner ? () => setOpenProfileEdit((prev) => !prev) : undefined
          }
        />
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
                    assets.defaultprofilepic
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
                      <button className="photo-buttons" onClick={openCamera}>
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

                    {user.profilePictureUrl.url && (
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
                    )}
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
    </>
  );
};

export default ProfilePicture;
