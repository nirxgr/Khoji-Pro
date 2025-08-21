import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets.js";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <img src={assets.logo1} alt="Khoji Pro Logo" className="logo-img" />
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2025 Khoji Pro. All rights reserved. Connecting professionals
            worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
