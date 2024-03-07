import React from 'react';
import { useParams } from 'react-router-dom';
import UserProfileForm from 'components/UserProfileForm';
import PostHeader from 'components/PostHeader/PostHeader';
import PasswordModal from 'components/PasswordModal';
import { useBlogContext } from 'BlogContext';
import Sidebar from 'components/Sidebar/Sidebar';
import Suggestions from 'components/Suggestions/Suggestions';

const UserProfile = () => {
  const {
    editMode,
    setEditMode,
    openPasswordModal,
    setIsPasswordModalOpen,
    isPasswordModalOpen,
    closePasswordModal,
  } = useBlogContext();

  const { userId } = useParams();
  console.log('======> UserID UserProfile:', userId);

  return (
    <div className='user-profile home-page'>
      <PostHeader
        editMode={editMode}
        setEditMode={setEditMode}
        showCheckbox={false}
        leftText={'Personal information'}
        rightText={'Edit'}
      />
      <UserProfileForm
        openPasswordModal={openPasswordModal}
        setIsPasswordModalOpen={setIsPasswordModalOpen}
        isPasswordModalOpen={isPasswordModalOpen}
        editMode={editMode}
        setEditMode={setEditMode}
        userId={userId}
      />
      {isPasswordModalOpen && (
        <div className='overlay' onClick={closePasswordModal}>
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <PasswordModal
              isOpen={isPasswordModalOpen}
              onClose={closePasswordModal}
            />
          </div>
        </div>
      )}
      <Sidebar />
      <Suggestions />
    </div>
  );
};

export default UserProfile;
