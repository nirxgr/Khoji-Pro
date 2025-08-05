import React,{ useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import './Auth.css'
import axios from 'axios'
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext.jsx';


const Login = () => {
    const {backendUrl, getUserData} = useContext(AppContext)
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const navigate = useNavigate();

    const onSubmitHandler = async (e)=> {
        try{
        e.preventDefault();
        
        //to send cookies as well
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + '/api/auth/login', {email,password})

            if (data.success){
              await getUserData();
              navigate('/home')
              toast.success(data.message)
            } else{
              toast.error(data.message)
            }
        }
        catch(error){
        console.error("Login error:", error);
        toast.error(error.response?.data?.message || "Something went wrong");
        }
    }


  return (
      <div className='main-container'>
        <img onClick = {() => navigate('/')}src={assets.logo1} alt='Logo' className='logo' />
        
        <div className='form-container'>
          <h2 className='form-title'>Login</h2>
          <p className='form-subtitle'>Login to your account!</p>
  
          <form onSubmit={onSubmitHandler}>
            
             <div className='input-group'>
              <img src={assets.mail_icon} alt=''/>
              <input 
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='input-field' type='email' placeholder='Email id' required/>
            </div>
  
             <div className='input-group'>
              <img src={assets.lock_icon} alt=''/>
              <input 
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='input-field' type='password' placeholder='Password' required/>
            </div>

            <p className='forgot-pass'onClick={ () => navigate('/reset-password')}>Forgot Password</p>
  
            <button className='submit-button'>Login</button>
  
          </form>

  
          <p className='auth-toggle'>Don't have an account?{' '}
            <span className='toggle-link' onClick={ () => navigate('/register')}>Signup</span>
          </p>
          
        </div>
      </div>
    )
}

export default Login
