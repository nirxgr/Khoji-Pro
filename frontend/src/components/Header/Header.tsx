import "./Header.css";
import { assets } from "../../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const defaultProfilePic =
    "http://res.cloudinary.com/dfuxutqkg/image/upload/v1754820563/wa3j0r4ica4c9jjtyotd.jpg";
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    navigate("/home");
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        !e.target.closest(".profile-circle") &&
        !e.target.closest(".dropdown")
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="container">
      <nav>
        <div className="logo">
          <img src={assets.logo1} alt="Logo" onClick={handleClick} />
        </div>
        <div className="profile-circle">
          <div className="profile-img-wrapper" onClick={() => setOpen(!open)}>
            <img
              src={userData.profilePictureUrl.url || defaultProfilePic}
              alt="profile-photo"
            />
          </div>
          {open && (
            <div className="dropdown">
              <ul>
                {userData?.profileStatus === "Completed" && (
                  <li
                    onClick={() => navigate(`/profile/${userData._id}`)}
                    className="dropdown-item"
                  >
                    <img
                      src={assets.profile}
                      alt="Profile Icon"
                      className="icon"
                    />
                    Edit Profile
                  </li>
                )}

                <li onClick={logout} className="dropdown-item">
                  <img src={assets.logout} alt="Logout Icon" className="icon" />
                  Log out
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
