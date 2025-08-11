import './Header.css'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Header = () => {
  const navigate = useNavigate()
  const { userData,backendUrl, setUserData, setIsLoggedin} = useContext (AppContext)
  const [open,setOpen] = useState(true);
  
  
  const logout = async ()=>{
    try{
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
      setIsLoggedin(false);
      setUserData(false);
      navigate('/');   
      }

    } catch(error){
        toast.error(error.message)
    }
  }


  return (
    <div className="container">
        <nav>
            <img src={assets.logo1} alt='Logo' className='logo'/>
            <div className="nav-links">
                <Link to='/home'>Home</Link>
                <Link to=''>About Us</Link>
                <Link to=''>Register as Professional</Link>
            </div>
            <div className='profile-circle'>
              <img src={userData.profilePictureUrl} alt="profile-photo" />
              
              <div className='dropdown'>
                <ul>
                  <li onClick={ () => navigate(`/profile/${userData._id}`)}> Profile</li>
                  <li onClick={logout}>Logout</li>
                </ul>
              </div>
            </div>

        </nav>
    </div>
  )
}

export default Header