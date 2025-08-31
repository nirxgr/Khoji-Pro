import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../shared/interfaces/user.interface";
import { AppContext } from "../../context/AppContext";
import { toggleFavorite } from "../../shared/service/favorite.service";
import { assets } from "../../assets/assets";
import "./favorites.css";
import "../home/home.css";

const Favorites = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContext);
  const [favoritesList, setFavoritesList] = useState<IUser[]>([]);
  const navigate = useNavigate();
  const [reloadFavorites, setReloadFavorites] = useState(false);
  useEffect(() => {
    if (!userData?._id) return;
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/fav/get-favorites/${userData._id}`
        );
        setFavoritesList(res.data.favorites);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setFavoritesList([]);
      }
    };
    fetchFavorites();
  }, [backendUrl, userData?._id, reloadFavorites]);

  return (
    <div className="favorites-page">
      <Header />
      <div className="favorites-header">
        <h1>Your Favorites</h1>
      </div>
      <div className="search-results">
        {favoritesList.length > 0 ? (
          favoritesList.map((user: IUser) => {
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
                          user.profilePictureUrl.url || assets.defaultprofilepic
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
                            isUserFavorite ? assets.favorite : assets.unfavorite
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
                  <p>{user.location}</p>
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
          })
        ) : (
          <p className="nofav-msg">You have no favorites yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
