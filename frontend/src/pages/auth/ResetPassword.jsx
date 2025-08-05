import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import './Auth.css'

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email,setEmail] = useState('')
  const [newPassword,setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const inputRefs = React.useRef([])

    const handleInput = (e, index)=> {
      if(e.target.value.length > 0 && index < inputRefs.current.length -1) {
        inputRefs.current[index + 1].focus();
      }
    }
  
    const handleKeyDown = (e, index) => {
      if(e.key === 'Backspace' && e.target.value === '' && index > 0){
        inputRefs.current[index - 1].focus();
      }
    }
  
    const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text')
      const pasteArray = paste.split('');
      pasteArray.forEach((char, index)=>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value = char;
        }
      })
    }


    const onSubmitEmail = async (e) => {
      e.preventDefault();
      try{
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp',{email})
        if(data.success){
          toast.success(data.message)
          data.success && setIsEmailSent(true)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
          toast.error(error.message)
      }
    }

    const onSubmitOTP = async (e) => {
      e.preventDefault();
      const otpArray = inputRefs.current.map(input => input.value);
      const joinedOtp = otpArray.join('');
      setOtp(joinedOtp);
      try{
      const {data} = await axios.post(backendUrl + '/api/auth/check-otp',{email, otp})
      if(data.success){
        setIsOtpSubmitted(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
      } catch (error) {
          toast.error(error.message)
      }
      
    }

   const onSubmitNewPassword = async (e) => {
    e.preventDefault();
     try{
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password',{ email, newPassword })
      if(data.success){
        toast.success(data.message)
        navigate ('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
    }
    
  }

  return (
    <div className='main-container'>
          <img onClick = {() => navigate('/')}src={assets.logo1} alt='Logo' className='logo' />
          

        {/* for email id */}
        {!isEmailSent && 
          <div className='form-container'>
            <h2 className='form-title'>Reset Password</h2>
            <p className='form-subtitle'>Enter your registered email address.</p>
            <form onSubmit={onSubmitEmail}>
               <div className='input-group'>
                <img src={assets.mail_icon} alt=''/>
                <input 
                onChange={e => setEmail(e.target.value)}
                value={email}
                className='input-field' type='email' placeholder='Email id'/>
              </div>
              <button className='submit-button'>Submit</button>
            </form>
          </div>
        }

      {/*otp input form*/}

    {!isOtpSubmitted && isEmailSent &&
     <div className='form-container'>
        <h2 className='form-title'>Reset Password OTP</h2>
        <p className='form-subtitle'>Enter the 6-digit code sent to your email id.</p>

        <form onSubmit={onSubmitOTP}>
          <div className='otp-container' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index)=>(
              <input type='text' maxLength='1' key={index}  className='otp-input' 
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index) }
              onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
      
          <button className='submit-button'>Submit</button>

        </form>
      
      </div>
    }

    {/* enter new password */}
      {isOtpSubmitted && isEmailSent &&
        <div className='form-container'>
            <h2 className='form-title'>New Password</h2>
            <p className='form-subtitle'>Enter the new password below.</p>
            <form onSubmit={onSubmitNewPassword}>
               <div className='input-group'>
                <img src={assets.lock_icon} alt=''/>
                <input 
                onChange={e => setNewPassword(e.target.value)}
                value={newPassword}
                className='input-field' type='password' placeholder='New Password' />
              </div>
              <button className='submit-button'>Submit</button>
            </form>
          </div>
      } 
          


        </div>
      
  )
}

export default ResetPassword