import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/pages/registration.scss';
import { useAuth } from 'components/AuthContext';

const Registration = () => {
  const { registration } = useAuth();

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [credentialsError, setCredentialsError] = useState({
    email: 'Email cannot be empty',
    password: 'Password cannot be empty',
    confirmPassword: 'Confirm password cannot be empty',
  });
  const [error, setError] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormValid(
      !credentialsError.email &&
        !credentialsError.password &&
        !credentialsError.confirmPassword &&
        credentials.email !== '' &&
        credentials.password !== '' &&
        credentials.confirmPassword !== '',
    );
  }, [credentialsError, credentials]);

  const handleChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;

    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Обновлять ошибку немедленно при изменении ввода
    validateField(field, value);
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        validateEmail(value);
        break;
      case 'password':
        validatePassword(value);
        break;
      case 'confirmPassword':
        validateConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const validateEmail = (value) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    setCredentialsError((prev) => ({
      ...prev,
      email: re.test(String(value).toLowerCase())
        ? ''
        : 'Incorrect email format',
    }));
  };

  const validatePassword = (value) => {
    const isPasswordValid =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_+=-]{8,100}$/;

    setCredentialsError((prev) => ({
      ...prev,
      password: isPasswordValid.test(value)
        ? ''
        : 'Password must be 8-100 characters and include at least one letter and one digit',
    }));
  };

  const validateConfirmPassword = (value) => {
    setCredentialsError((prev) => ({
      ...prev,
      confirmPassword:
        value === credentials.password ? '' : 'Passwords do not match',
    }));
  };

  const roleHandler = (e) => {
    setSelectedRole(e.target.value);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(
        (prevShowConfirmPassword) => !prevShowConfirmPassword,
      );
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (
      credentialsError.email ||
      credentialsError.password ||
      credentialsError.confirmPassword
    ) {
      return;
    }

    if (formValid) {
      try {
        await registration({
          email: credentials.email,
          password: credentials.password,
          confirmPassword: credentials.confirmPassword,
          role: selectedRole,
        });
        navigate('/homeblog');
      } catch (error) {
        console.error('Registration failed:', error.message);
        if (error.response) {
          setError(
            error.response.data.message ||
              'Registration failed. Please try again.',
          );
        } else {
          setError('Registration failed. Please try again later.');
        }
      }
    }
  };

  return (
    <>
      <div className='registration'>
        <div className='container'>
          {error && <div className='text-error'>{error}</div>}
          <form className='form' onSubmit={onSubmitHandler}>
            <h1>Create Account</h1>
            <p>
              Already have an account?&nbsp;
              <Link to='/login'>Login</Link>
            </p>
            <br />
            {credentialsError.email && (
              <div className='text-error'>{credentialsError.email}</div>
            )}
            <input
              data-test='email'
              onChange={handleChange}
              value={credentials.email}
              name='email'
              type='text'
              placeholder='Email'
            />
            {credentialsError.password && (
              <div className='text-error'>{credentialsError.password}</div>
            )}
            <label className='input-password__wrapper'>
              <input
                className='input-password'
                data-test='password'
                onChange={handleChange}
                value={credentials.password}
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
              />

              <span
                className='password-toggle-icon'
                onClick={() => togglePasswordVisibility('password')}
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
            {credentialsError.confirmPassword && (
              <div className='text-error'>
                {credentialsError.confirmPassword}
              </div>
            )}
            <label className='input-password__wrapper'>
              <input
                className='input-password'
                data-test='confirmPassword'
                onChange={handleChange}
                value={credentials.confirmPassword}
                name='confirmPassword'
                type={showConfirmPassword ? 'text' : 'text'}
                placeholder='Confirm password'
              />
              <span
                className='password-toggle-icon'
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showConfirmPassword ? (
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
              Registration
            </button>
            <select onChange={roleHandler} value={selectedRole}>
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
            <div className='user-info'>
              <p>
                <Link to='/contact'>Contact us</Link>
              </p>
              <p>
                <Link to='/about'>About us</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
