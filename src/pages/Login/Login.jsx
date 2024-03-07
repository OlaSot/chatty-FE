import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'components/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormValid(!emailError && !passwordError && credentials.email !== '');
  }, [emailError, passwordError, credentials.email, credentials.password]);

  const emailHandler = (e) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    setCredentials({
      ...credentials,
      email: e.target.value,
    });

    if (!re.test(String(e.target.value).toLowerCase())) {
      setEmailError('Incorrect email');
    } else {
      setEmailError('');
    }
  };

  const passwordHandler = (e) => {
    setCredentials({
      ...credentials,
      password: e.target.value,
    });

    const isPasswordValid =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_+=-]{8,100}$/.test(
        e.target.value,
      );

    if (!isPasswordValid) {
      setPasswordError(
        'Password must be 8-100 characters and include at least one letter and one digit',
      );
    } else {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    try {
      await login(credentials);
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        const decodedAccessToken = jwtDecode(accessToken);
        const decodedRefreshToken = jwtDecode(refreshToken);

        console.log('1 ==>> Decoded Access Token:', decodedAccessToken);
        console.log('2 ==>> Decoded Refresh Token:', decodedRefreshToken);
        if (decodedAccessToken.role === 'ADMIN') {
          navigate('/users');
        } else {
          navigate('/homeblog');
        }
      }
    } catch (error) {
      const status = error.response ? error.response.status : null;

      switch (status) {
        case 400:
          setErrorMessage('Invalid email or password. Please try again.');
          break;
        case 404:
          setErrorMessage('User not found. Please register.');
          break;
        default:
          setErrorMessage(
            'An error occurred while logging in. Please try again later.',
          );
      }
    }
  };

  return (
    <>
      <div className='registration'>
        <div className='container'>
          {errorMessage && <div className='text-error'>{errorMessage}</div>}
          <form className='form' onSubmit={onSubmitHandler}>
            <h1>Login Form</h1>
            <p className='link'>
              Don't have an account?&nbsp;
              <Link to='/registration'>Sign up</Link>
            </p>
            {emailError && <div className='text-error'>{emailError}</div>}

            <input
              data-test='email'
              onChange={emailHandler}
              value={credentials.email}
              name='email'
              type='text'
              placeholder='Email'
            />
            {passwordError && <div className='text-error'>{passwordError}</div>}
            <label className='input-password__wrapper'>
              <input
                className='input-password'
                data-test='password'
                onChange={passwordHandler}
                value={credentials.password}
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
              />
              <span
                className='password-toggle-icon'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <img
                    className='password-eye'
                    src='/Login/openeye1.png'
                    alt='open'
                  />
                ) : (
                  <img
                    className='password-eye'
                    src='/Login/closeye1.png'
                    alt='close'
                  />
                )}
              </span>
            </label>
            <button
              className='registration-btn'
              data-test='submit'
              disabled={!formValid}
              type='submit'
            >
              Login
            </button>
          </form>{' '}
          <p>
            Not registered yet?&nbsp;
            <Link to='/registration'>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
