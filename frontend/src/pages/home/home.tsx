import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header.tsx";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/HeroSection/HeroSection.tsx";
import { assets } from "../../assets/assets.js";
import "./home.css";
import { AppContext } from "../../context/AppContext.jsx";
import axios from "axios";
import { IUser } from "../../shared/interfaces/user.interface.tsx";
import { toggleFavorite } from "../../shared/service/favorite.service.tsx";

const Home = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState<IUser[]>([]);
  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = ["All", "People", "Profession", "Location", "Skills"];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: string) => {
    setIsOpen(false);
    setFilterBy(option);
  };

  useEffect(() => {
    if (!search.trim()) {
      setUserList([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams();
      params.append("query", search);
      if (filterBy.toLowerCase() !== "") {
        params.append("filterBy", filterBy.toLowerCase());
      }

      axios
        .get(`${backendUrl}/api/user/search?${params.toString()}`)
        .then((res) => {
          setUserList(res.data);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setUserList([]);
        });
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [search, filterBy, backendUrl]);

  return (
    <div className="main">
      <Header />
      <Hero />
      <div className="search-bar">
        <img src={assets.search} className="search-icon" />
        <input
          type="text"
          placeholder="Search for professionals"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>

      {search.trim() === "" ? (
        <>
          <div className="content">
            <h1>Explore Professional Categories</h1>
            <p>Discover verified professionals across various fields</p>
          </div>

          <div className="content-group">
            <div className="content-card">
              <h2>UI/UX Designers</h2>
              <p>Experts in user experience and interface design</p>
              <h4>850+ Professionals</h4>
            </div>
            <div className="content-card">
              <h2>Developers</h2>
              <p>Code builders for web, mobile, and software</p>
              <h4>3000+ Professionals</h4>
            </div>
            <div className="content-card">
              <h2>Data Analysts</h2>
              <p>Insight extractors from complex data sets</p>
              <h4>700+ Professionals</h4>
            </div>
            <div className="content-card">
              <h2>QA Engineers</h2>
              <p>Testers ensuring software quality and reliability</p>
              <h4>600+ Professionals</h4>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="result-filter">
            <div className="record-count">
              <p>{userList.length} users found.</p>
            </div>

            <div className="filter-dropdown">
              <button className="filter-button" onClick={toggleDropdown}>
                <img src={assets.filter} className="filter-icon" />
                <span>{filterBy || "Filters"}</span>
              </button>

              {isOpen && (
                <ul className="dropdown-menu">
                  {filterOptions.map((option) => (
                    <li key={option}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleSelect(option)}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="search-results">
            {userList.length > 0 &&
              userList.map((user: IUser) => {
                const isUserFavorite = userData.favorites?.includes(user._id);
                const handleToggleFavorite = async (
                  e: React.MouseEvent,
                  userId: string,
                  isCurrentlyFavorite: boolean
                ) => {
                  e.stopPropagation();
                  try {
                    await toggleFavorite(
                      backendUrl,
                      userId,
                      isCurrentlyFavorite
                    );
                    await getUserData();
                  } catch (err) {
                    console.error("Error toggling favorite:", err);
                  }
                };
                return (
                  <div
                    onClick={() => navigate(`/profile/${user._id}`)}
                    key={user.email}
                    className="result-card"
                  >
                    <div className="card-header">
                      <div className="card-picture">
                        <img
                          src={
                            user.profilePictureUrl.url ||
                            assets.defaultprofilepic
                          }
                          alt="profile-photo"
                        />
                      </div>
                      <div className="card-details">
                        <p className="title">
                          {user.firstName} {user.lastName}{" "}
                          {userData._id === user._id && "(You)"}
                        </p>
                        <p className="sub-title">{user.profession}</p>
                        <p>{user.location}</p>
                      </div>

                      {userData._id !== user._id && (
                        <div className="favorite-button-wrapper">
                          <button
                            className="favorite-button"
                            onClick={(e) =>
                              handleToggleFavorite(
                                e,
                                user._id.toString(),
                                isUserFavorite
                              )
                            }
                          >
                            <img
                              src={
                                isUserFavorite
                                  ? assets.favorite
                                  : assets.unfavorite
                              }
                              alt="edit-icon"
                              className="favorite-icon"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="extra-details">
                      <p className="bio-text">{user.bio}</p>
                      <div className="languages-wrapper">
                        {(user.skills ?? [])
                          .slice(0, 4)
                          .map((skillObj, index) => (
                            <span
                              key={skillObj._id || index}
                              className="skill-tag"
                            >
                              {skillObj.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
