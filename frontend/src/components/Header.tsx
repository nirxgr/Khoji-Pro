import "./Header.css";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const defaultProfilePic =
    "http://res.cloudinary.com/dfuxutqkg/image/upload/v1754820563/wa3j0r4ica4c9jjtyotd.jpg";
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

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

  return (
    <div className="container">
      <nav>
        <div>
          <img src={assets.logo1} alt="Logo" className="logo" />
        </div>
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="">About Us</Link>
        </div>
        <div className="profile-circle">
          <div className="profile-img-wrapper">
            <img
              src={userData.profilePictureUrl.url || defaultProfilePic}
              alt="profile-photo"
            />
          </div>

          <div className="dropdown">
            <ul>
              <li onClick={() => navigate(`/profile/${userData._id}`)}>
                {" "}
                Profile
              </li>
              <li onClick={logout}>Logout</li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
