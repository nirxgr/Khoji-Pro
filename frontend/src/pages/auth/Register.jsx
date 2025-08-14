import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext.jsx'
import './Auth.css'
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';


const Register = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl } = useContext(AppContext)

  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState('Sign Up')


  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onBlur' });

  const navigate = useNavigate();

  const inputRefs = React.useRef([])
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {

      e.preventDefault();

      axios.defaults.withCredentials = true
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { firstName, lastName, email, password })

        if (data.success) {
          setState('Otp')
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }

      } else {
        const otpArray = inputRefs.current.map(e => e.value)
        const otp = otpArray.join('')

        const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { firstName, lastName, email, password, otp })

        if (data.success) {
          toast.success(data.message)
          navigate('/login')
        } else {
          toast.error(data.message)
        }

      }
    }

    catch (error) {
      toast.error(error.message)
    }

    finally {
      reset();
    }
  }




  return (
    <div className='main-container'>
      <img onClick={() => navigate('/')} src={assets.logo1} alt='Logo' className='logo' />

      {state === 'Sign Up' ? (
        <div className='form-container'>
          <h2 className='form-title'>Sign Up</h2>
          <p className='form-subtitle'>Create your account</p>

          <form onSubmit={handleSubmit(onSubmitHandler)} >
            <div className='input-components'>
              <div className='input-wrapper'>
                <div className='input-group'>
                  <img src={assets.person_icon} alt='' />
                  <input
                    onChange={e => setfirstName(e.target.value)}
                    name='firstName'
                    className='input-field' type='text' placeholder='First Name'
                    {...register("firstName", {
                      required: {
                        value: true,
                        message: "First name is required."
                      }
                    })
                    } />
                </div>
                {errors.firstName &&
                  <p className='form-error'>{errors.firstName?.message}</p>}
              </div>

              <div className='input-wrapper'>
                <div className='input-group'>
                  <img src={assets.person_icon} alt='' />
                  <input
                    onChange={e => setlastName(e.target.value)}
                    name='lastName'
                    className='input-field' type='text' placeholder='Last Name'
                    {...register("lastName", {
                      required: {
                        value: true,
                        message: "Last name is required."
                      }
                    })}

                  />
                </div>
                {errors.lastName &&
                  <p className='form-error'>{errors.lastName?.message}</p>}
              </div>

              <div className='input-wrapper'>
                <div className='input-group'>
                  <img src={assets.mail_icon} alt='' />
                  <input
                    onChange={e => setEmail(e.target.value)}
                    name='email'
                    className='input-field' type='email' placeholder='Email id'
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is required."
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address.'
                      }
                    })}
                  />
                </div>
                {errors.email &&
                  <p className='form-error'>{errors.email?.message}</p>}
              </div>

              <div className='input-wrapper'>
                <div className='input-group'>
                  <img src={assets.lock_icon} alt='' />
                  <input
                    onChange={e => setPassword(e.target.value)}
                    name='password'
                    className='input-field' type='password' placeholder='Password'
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is required."
                      },
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters."
                      }
                    })}
                  />
                </div>
                {errors.password &&
                  <p className='form-error'>{errors.password?.message}</p>}
              </div>
            </div>

            <button className='submit-button' disabled={isSubmitting} type='submit'>Sign Up</button>

          </form>

          <p className='auth-toggle'>Already have an account?{' '}
            <span className='toggle-link' onClick={() => navigate('/login')}>Login here</span>
          </p>

        </div>
      ) : (
        <div className='form-container'>
          <h2 className='form-title'>Email Verify OTP</h2>
          <p className='form-subtitle'>Enter the 6-digit code sent to your email id.</p>

          <form onSubmit={onSubmitHandler}>
            <div className='otp-container' onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input type='text' maxLength='1' key={index} required className='otp-input'
                  ref={e => inputRefs.current[index] = e}
                  onInput={(e) => handleInput(e, index)}
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