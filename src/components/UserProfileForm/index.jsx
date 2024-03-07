import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import ImageUpload from 'components/ImageUpload';
import rightArrow from 'assets/right-arrow.svg';
import api, { getMe, getUsers } from 'components/Api';
import * as yup from 'yup';
import s from '../ImageUpload/user.module.css';

const UserProfileForm = ({
  openPasswordModal,
  setEditMode,
  editMode,
  userId,
}) => {
  const defaultUserPhotoUrl =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    gender: '',
    birthDate: '',
    phone: '',
    avatarUrl: defaultUserPhotoUrl,
  });
  const [formErrors, setFormErrors] = useState({});

  const userProfileSchema = yup.object().shape({
    name: yup.string().nullable(true),
    surname: yup.string().nullable(true),
    gender: yup.string().nullable(true),
    birthDate: yup.date().nullable(true),
    phone: yup.string().nullable(true),
    avatarUrl: yup.string().nullable(true),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getMe();
        if (userId && result.role === 'ADMIN') {
          const users = await getUsers();
          result = users.find((user) => user.id === userId) || result;
        }
        setUserData((prev) => ({
          ...prev,
          ...result,
          birthDate: result.birthDate
            ? formatDateForInput(result.birthDate)
            : '',
          avatarUrl: result.avatarUrl || defaultUserPhotoUrl,
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [userId]);

  const handleImageUpload = (url) => {
    setUserData({ ...userData, avatarUrl: url });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
      .map((n) => n.toString().padStart(2, '0'))
      .join('.');
  };

  const prepareDataForSubmission = (data) => {
    const preparedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key] === '' ? null : data[key];
      return acc;
    }, {});
    if (preparedData.birthDate) {
      preparedData.birthDate = new Date(
        preparedData.birthDate.split('.').reverse().join('-'),
      ).toISOString();
    }
    return preparedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = prepareDataForSubmission(userData);

    try {
      await userProfileSchema.validate(submissionData, { abortEarly: false });
      const response = await api.put(
        `/api/users/${userData.id}`,
        submissionData,
      );
      console.log('Data successfully updated:', response.data);
      setEditMode(false);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setFormErrors(errors);
      } else {
        console.error('Error updating user data:', error);
      }
    }
  };

  if (!userData.id) return <div>Loading...</div>;
  return (
    <div className='container'>
      <form
        onSubmit={handleSubmit}
        className='user-form'
        data-test='userProfileForm'
      >
        <div className='upper-block'>
          <ImageUpload
            handleImageUpload={handleImageUpload}
            defaultPhoto={userData.avatarUrl}
            className={s.dropzone}
            isUserForm={true}
          />
          {formErrors.avatar && (
            <div className='error-message'>{formErrors.avatar}</div>
          )}
          <p data-test='profileEmail'>{userData.email}</p>
        </div>
        <div className='form-block'>
          <div className='label__block'>
            <label htmlFor='name'>Name</label>
            <input
              className='data-input'
              data-test='profileName'
              type='text'
              name='name'
              value={userData.name}
              onChange={handleChange}
              placeholder='Name'
              disabled={!editMode}
            />
            {formErrors.name && (
              <div className='error-message'>{formErrors.name}</div>
            )}
          </div>
          <div className='label__block'>
            <label htmlFor='birthDate'>Birthdate</label>
            <input
              type={userData.birthDate ? 'date' : 'text'}
              id='birthDate'
              name='birthDate'
              value={
                userData.birthDate
                  ? userData.birthDate.split('.').reverse().join('-')
                  : ''
              }
              className='data-input'
              onChange={(e) => {
                const value = e.target.value
                  ? e.target.value.split('-').reverse().join('.')
                  : '';
                handleChange({ target: { name: e.target.name, value } });
              }}
              placeholder={userData.birthDate ? '' : 'DD.MM.YYYY'}
              disabled={!editMode}
            />
            {formErrors.birthDate && (
              <div className='error-message'>{formErrors.birthDate}</div>
            )}
          </div>
        </div>
        <div className='form-block'>
          <div className='label__block'>
            <label htmlFor='surname'>Surname</label>
            <input
              className='data-input'
              data-test='profileSurname'
              type='text'
              name='surname'
              value={userData.surname}
              onChange={handleChange}
              placeholder='Surname'
              disabled={!editMode}
            />
            {formErrors.surname && (
              <div className='error-message'>{formErrors.surname}</div>
            )}
          </div>
          <div className='label__block'>
            <label htmlFor='phone'>Phone</label>
            <InputMask
              mask='+99999999999'
              value={userData.phone}
              onChange={handleChange}
              className='data-input'
              name='phone'
              placeholder='+123456789012'
              disabled={!editMode}
              maskChar={null}
            />
            {formErrors.phone && (
              <div className='error-message'>{formErrors.phone}</div>
            )}
          </div>
        </div>
        <div className='form-block'>
          <div className='label__block'>
            <label htmlFor='gender'>Gender</label>
            <select
              id='gender'
              data-test='profileGender'
              name='gender'
              value={userData.gender}
              onChange={handleChange}
              disabled={!editMode}
            >
              <option value=''>Select</option>
              <option value='MALE'>MALE</option>
              <option value='FEMALE'>FEMALE</option>
            </select>
            {formErrors.gender && (
              <div className='error-message'>{formErrors.gender}</div>
            )}
          </div>
          <div className='label__block'>
            <label htmlFor='password'>Password</label>
            <button
              className='data-input pass__btn'
              name='password'
              onClick={openPasswordModal}
              type='button'
              data-test='profileChangePasswordButton'
            >
              Change password
              <img src={rightArrow} alt='right arrow' />
            </button>
          </div>
        </div>
        <button
          type='submit'
          className='save__btn'
          data-test='profileSaveButton'
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
