import React, { useState } from "react";
import { assets } from "../../assets/assets";
import "./landing.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer.tsx";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="nav-logo">
          <img
            src={assets.logo1}
            alt="Khoji Pro Logo"
            className="logo"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="nav-buttons">
          <button className="btn btn-login" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="btn btn-signup"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </nav>
      <div className="hero">
        <h1>
          Find the perfect <span className="highlight">professionals</span> for
          your needs.
        </h1>

        <p>
          Khoji Pro connects you with experts across various fields. Search by
          name, profession, or skills.
        </p>
      </div>
      <div className="search-bar">
        <img src={assets.search} className="search-icon" />
        <input
          type="text"
          placeholder="Search for professionals"
          className="search-input"
        />
        <button className="search-button" onClick={() => navigate("/login")}>
          Search
        </button>
      </div>
      <section className="features">
        <h2 className="features-title">Why Choose Khoji Pro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <img src={assets.search2} />
            </div>
            <h3 className="feature-title">Search by Skills</h3>
            <p className="feature-description">
              Find experts with the exact skills you need for your project or
              business.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={assets.handshake} />
            </div>
            <h3 className="feature-title">Connect with Experts</h3>
            <p className="feature-description">
              Directly message and collaborate with professionals in your field.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={assets.network} />
            </div>
            <h3 className="feature-title">Expand Your Network</h3>
            <p className="feature-description">
              Build meaningful professional relationships that grow your career.
            </p>
          </div>
        </div>
      </section>
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h3 className="features-subtitle">
              Discover the power of professional networking with our advanced
              search and connection features.
            </h3>
          </div>

          <div className="features-group">
            <div className="feature-div">
              <div className="feature-box">
                <img src={assets.shield} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Verified Professionals</h3>
                <p className="feature-desc">
                  Access a curated list of verified professionals. Trust the
                  expertise of each profile before making connections or hiring
                  decisions.
                </p>
              </div>
            </div>

            <div className="feature-div">
              <div className="feature-box">
                <img src={assets.userplus} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Connect with Experts</h3>
                <p className="feature-desc">
                  Build meaningful professional relationships. Connect directly
                  with industry experts and thought leaders in your field.
                </p>
              </div>
            </div>

            <div className="feature-div">
              <div className="feature-box">
                <img src={assets.network2} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Hire Talents for Your Project</h3>
                <p className="feature-desc">
                  Quickly find and hire professionals with the right skills for
                  your project. Streamline the hiring process and get your work
                  done efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
