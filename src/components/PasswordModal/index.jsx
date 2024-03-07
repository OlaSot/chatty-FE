import React, { useState } from 'react';
import s from './index.module.css';
import { updatePassword } from 'components/Api';
import openEye from '../../assets/images/openeye.png';
import closedEye from '../../assets/images/closeye.png';

const PasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }

    try {
      const passwordData = {
        currentPassword,
        newPassword,
        confirmPassword,
      };
      const response = await updatePassword(passwordData);
      console.log(response);
      setError('');
      onClose();
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={s.password_modal}>
      <div className={s.password_modal_content}>
        <p className={s.passParagraph}>Password</p>
        <div className={s.inputWrapper}>
          <input
            type={showCurrentPassword ? "text" : "password"}
            className={s.pass_input}
            placeholder='Old password'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <img src={showCurrentPassword ? openEye : closedEye} onClick={toggleCurrentPasswordVisibility} alt="Toggle visibility" className={s.toggleVisibilityIcon} />
        </div>
        <div className={s.inputWrapper}>
          <input
            type={showNewPassword ? "text" : "password"}
            className={s.pass_input}
            placeholder='New password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <img src={showNewPassword ? openEye : closedEye} onClick={toggleNewPasswordVisibility} alt="Toggle visibility" className={s.toggleVisibilityIcon} />
        </div>
        <div className={s.inputWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={s.pass_input}
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <img src={showConfirmPassword ? openEye : closedEye} onClick={toggleConfirmPasswordVisibility} alt="Toggle visibility" className={s.toggleVisibilityIcon} />
        </div>
        {error && <p className={s.error}>{error}</p>}
        <button className={s.pass_btn} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};
export default PasswordModal;
