import React, { useState } from 'react';
import { createFeedback } from '../../components/Api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [successMessage, setSuccessMessage] = useState(''); 
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));


    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(value);
      setEmailError(isValidEmail ? '' : 'Invalid email format');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (emailError) {
      return;
    }

    try {

      const response = await createFeedback(formData);


      console.log('Server Response:', response);


      setFormData({
        name: '',
        email: '',
        content: '',
      });

      setSuccessMessage('Feedback submitted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 60000);
    } catch (error) {

      console.error('Error:', error);
    }
  };

  return (
    <div className='contact'>
      <div className='container'>
        <div className='contact-box'>
          {successMessage && (
            <div className='success-message'>{successMessage}</div>
          )}
          <h1>Contact Us</h1>
          <form className='form' onSubmit={handleSubmit}>
            <div className='form-item'>
              <label htmlFor='name'></label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Name'
                required
              />
            </div>
            <div className='form-item'>

              {emailError && <p className='error'>{emailError}</p>}
              <label htmlFor='email'></label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email'
                required
              />
            </div>
            <div className='form-item'>
              <label htmlFor='content'></label>
              <textarea
                id='content'
                name='content'
                value={formData.content}
                onChange={handleChange}
                placeholder='Message'
                required
              ></textarea>
            </div>
            <div className='form-item'>
              <button type='submit'>Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
