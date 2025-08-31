import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../../shared/interfaces/user.interface";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import ContactDetailsForm from "./ContactDetailsForm";

interface ContactSectionProps {
  user: IUser;
  isOwner: boolean;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactDetailsSection: React.FC<ContactSectionProps> = ({
  user,
  isOwner,
  setReloadUser,
}) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const { backendUrl } = useContext(AppContext);
  useEffect(() => {
    if (showContactForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showContactForm]);
  return (
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
          <img src={assets.mail2} alt="mail icon" className="location-icon" />
          {user.email || "---"}
        </p>
        <p className="location">
          <img src={assets.phone2} alt="mail icon" className="location-icon" />
          {user.phoneNumber || "---"}
        </p>
      </div>
      {showContactForm && user && (
        <ContactDetailsForm
          user={user}
          backendUrl={backendUrl}
          setReloadUser={setReloadUser}
          setShowContactForm={setShowContactForm}
        />
      )}
    </div>
  );
};

export default ContactDetailsSection;
