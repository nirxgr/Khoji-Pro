import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { CameraCapture } from "../Camera/CameraCapture.tsx";
import { IUser } from "../../shared/interfaces/user.interface.tsx";

interface ProfileCoverProps {
  user: IUser;
  isOwner: boolean;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileCover: React.FC<ProfileCoverProps> = ({
  setReloadUser,
  user,
  isOwner,
}) => {
  const { videoRef, openCamera, capturePhoto, stream, setStream } =
    CameraCapture({
      onCapture: (file, preview) => {
        setSelectedFile(file);
        setPreviewUrl(preview);
      },
    });
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { backendUrl } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleCoverUploadCancel = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setOpen(false);
  };
  const handleExit = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
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
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error deleting cover picture");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="cover-container" ref={containerRef}>
        <img
          src={user.coverPictureUrl.url || assets.defaultcoverpic}
          alt="cover-photo"
          className="cover-photo"
        />
        {isOwner && (
          <button
            className="edit-icon-btn"
            onClick={() => setOpen((prev) => !prev)}
          >
            <img src={assets.pencil} alt="edit-icon" className="edit-icon" />
          </button>
        )}

        {open && (
          <>
            <div className="overlay" onClick={handleCoverUploadCancel}></div>

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
                      assets.defaultcoverpic
                    }
                    alt="Cover Photo"
                  />
                )}
              </div>
              {!selectedFile ? (
                <div className="edit-photo-buttons">
                  {stream ? (
                    <button className="capture-button" onClick={capturePhoto} />
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

                      {user.coverPictureUrl.url && (
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
    </>
  );
};

export default ProfileCover;
