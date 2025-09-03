import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../shared/interfaces/user.interface";
import { AppContext } from "../../context/AppContext";
import { toggleFavorite } from "../../shared/service/favorite.service";
import { assets } from "../../assets/assets";
import "../home/home.css";

const Explore = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContext);
  const [allUsersList, setAllUsersList] = useState<IUser[]>([]);
  const navigate = useNavigate();
  const [reloadFavorites, setReloadFavorites] = useState(false);
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState<IUser[]>([]);

  const [filterBy, setFilterBy] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [search, filterBy, backendUrl]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userData?._id) return;
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/getAllUsers`);
        setAllUsersList(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setAllUsersList([]);
      }
    };
    fetchFavorites();
  }, [backendUrl, userData?._id, reloadFavorites]);

  return (
    <div className="favorites-page">
      <Header />
      <div className="favorites-header">
        <h1>Explore</h1>
      </div>
      <div className="search-bar">
        <img src={assets.search} className="search-icon" />
        <input
          type="text"
          placeholder="Search to explore professionals"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>
      {search.trim() === "" ? (
        <div className="search-results">
          {allUsersList.length > 0 &&
            allUsersList.map((user: IUser) => {
              const isUserFavorite = userData.favorites?.includes(user._id);
              const handleToggleFavorite = async (
                e: React.MouseEvent,
                userId: string,
                isCurrentlyFavorite: boolean
              ) => {
                e.stopPropagation();
                try {
                  await toggleFavorite(backendUrl, userId, isCurrentlyFavorite);
                  await getUserData();
                  setReloadFavorites((prev) => !prev);
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
                    <div className="card-wrapper">
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
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="sub-title">{user.profession}</p>
                      </div>
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
                  <div className="location-wrapper">
                    <img src={assets.location} />
                    <p>
                      {user.location}
                      {userData._id === user._id && " • You"}
                    </p>
                  </div>

                  <div className="extra-details">
                    <p className="bio-text">{user.bio}</p>
                  </div>
                  <div className="languages-wrapper">
                    {(user.skills ?? []).slice(0, 6).map((skillObj, index) => (
                      <span key={skillObj._id || index} className="skill-tag">
                        {skillObj.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <>
          <div className="result-filter">
            <div className="record-count">
              {userList?.length === 0 ? (
                <p>No users found.</p>
              ) : userList?.length === 1 ? (
                <p>{userList.length} user found.</p>
              ) : (
                <p>{userList.length} users found.</p>
              )}
            </div>

            <div className="filter-dropdown" ref={dropdownRef}>
              <button className="filter-button" onClick={toggleDropdown}>
                <img src={assets.filter} className="filter-icon" />
                <span>{filterBy || "Filters"}</span>
              </button>

              {isOpen && (
                <div className="dropdown-menu">
                  <ul>
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
                </div>
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
                      <div className="card-wrapper">
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
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="sub-title">{user.profession}</p>
                        </div>
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
                    <div className="location-wrapper">
                      <img src={assets.location} />
                      <p>
                        {user.location}
                        {userData._id === user._id && " • You"}
                      </p>
                    </div>

                    <div className="extra-details">
                      <p className="bio-text">{user.bio}</p>
                    </div>
                    <div className="languages-wrapper">
                      {(user.skills ?? [])
                        .slice(0, 6)
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
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;
