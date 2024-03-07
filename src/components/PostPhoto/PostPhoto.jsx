import React from 'react';
import ChattyBack from '../../assets/images/chattyBack.png'

const PostPhoto = ({ photo }) => {
  const defaultPhotoUrl =
    ChattyBack;

  const handleImageError = (event) => {

    event.target.src = defaultPhotoUrl; 
  };

  return (
    <div className='post-photo'>
      <img
        src={photo || defaultPhotoUrl}
        alt='Post'
        onError={handleImageError} 
      />
    </div>
  );
};

export default PostPhoto;
