import React,{ useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext.jsx'
import './Auth.css'
import { toast } from 'react-toastify';


const Register = () => {
    axios.defaults.withCredentials = true;
    const {backendUrl} = useContext(AppContext)

    const[firstName,setfirstName] = useState('')
    const[lastName,setlastName] = useState('')
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const[state,setState] = useState('Sign Up')

    const navigate = useNavigate();

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

    const onSubmitHandler = async (e) => {
      try {

        e.preventDefault();

        axios.defaults.withCredentials = true
        if(state === 'Sign Up'){
        const {data} = await axios.post(backendUrl + '/api/auth/register', {firstName,lastName,email,password})
        
        if (data.success){
          setState('Otp')
          toast.success(data.message)
        } else{
          toast.error(data.message)
        }

      } else{
          const otpArray = inputRefs.current.map(e => e.value)
          const otp = otpArray.join('')

          const {data} = await axios.post(backendUrl + '/api/auth/verify-account',{firstName,lastName,email,password,otp})

             if(data.success){
              toast.success(data.message)
              navigate('/login')
            } else {
              toast.error(data.message)
            }

      } 
    }

      catch(error){
          toast.error(error.message)
      }
    }

   


    return (
    <div className='main-container'>
      <img onClick = {() => navigate('/')}src={assets.logo1} alt='Logo' className='logo' />
      
      {state === 'Sign Up' ? (
      <div className='form-container'>
        <h2 className='form-title'>Sign Up</h2>
        <p className='form-subtitle'>Create your account</p>

        <form onSubmit={onSubmitHandler}>
          <div className='input-group'>
            <img src={assets.person_icon} alt=''/>
            <input 
            onChange={e => setfirstName(e.target.value)}
            value={firstName}
            className='input-field' type='text' placeholder='First Name' required/>
          </div>

          <div className='input-group'>
            <img src={assets.person_icon} alt=''/>
            <input 
            onChange={e => setlastName(e.target.value)}
            value={lastName}
            className='input-field' type='text' placeholder='Last Name' required/>
          </div>
          
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


          <button className='submit-button'>Sign Up</button>

        </form>

        <p className='auth-toggle'>Already have an account?{' '}
          <span className='toggle-link' onClick={ () => navigate('/login')}>Login here</span>
        </p>
      
      </div>
      ) : (
      <div className='form-container'>
        <h2 className='form-title'>Email Verify OTP</h2>
        <p className='form-subtitle'>Enter the 6-digit code sent to your email id.</p>

        <form onSubmit={onSubmitHandler}>
          <div className='otp-container' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index)=>(
              <input type='text' maxLength='1' key={index} required className='otp-input' 
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index) }
              onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
      
          <button className='submit-button'>Verify Email</button>

        </form>
      
      </div>

        )}
    </div>
  )
}

export default Register