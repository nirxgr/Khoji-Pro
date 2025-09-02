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
        <div className="profile-title-wrapper">
          <div className="icon-wrapper">
            <img src={assets.contact} className="icon-wrapper-img" />
          </div>
          <h3 className="profile-section-title">Contact Information</h3>
        </div>

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
        <div className="location">
          <div className="contact-img">
            <img src={assets.mail2} alt="mail icon" className="location-icon" />
          </div>
          <p>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="email-click"
            >
              {user.email}
            </a>
          </p>
        </div>
        <div className="location">
          <div className="contact-img">
            <img
              src={assets.phone2}
              alt="mail icon"
              className="location-icon"
            />
          </div>
          <p>{user.phoneNumber}</p>
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
    </div>
  );
};

export default ContactDetailsSection;
