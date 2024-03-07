import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from 'components/Api';
import cameraIcon from 'assets/camera.svg';
import userStyles from './user.module.css';
import postStyles from './post.module.css';

function ImageUpload({ handleImageUpload, defaultPhoto, isUserForm }) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) {
        console.error('No file selected');
        setError('No file selected');
        return;
      }
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        console.error('File size exceeds the 2MB limit');
        setError('File size exceeds the 2MB limit');
        return;
      } else {
        setError('');
      }
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        console.error('Only .jpg, .jpeg, .png files are allowed');
        setError('Only .jpg, .jpeg, .png files are allowed');
        return;
      }

      const formData = new FormData();
      formData.append('multipartFile', file);
      setIsUploading(true);

      try {
        const response = await api.post('/api/images', formData);
        handleImageUpload(response.data.imageUrl);
        setImageUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Error uploading image');
      } finally {
        setTimeout(() => {
          setIsUploading(false);
        }, 500);
      }
    },
    [handleImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`${isUserForm ? userStyles.dropzone : postStyles.dropzone} ${isDragActive ? userStyles.active : ''}`}
    >
      <input {...getInputProps()} />

      {isUploading && <p className={userStyles.uploaded_text}>Uploading...</p>}
      {!isUserForm && (
        <div className={postStyles.uploaded_image}>
          {(imageUrl || defaultPhoto) && !error && !isUploading && (
            <img
              src={imageUrl || defaultPhoto}
              alt='Uploaded'
              className={postStyles.uploaded_image}
              data-test='uploaded-image'
            />
          )}

          {!imageUrl &&
            !defaultPhoto &&
            (error ? (
              <p
                className={`${isUserForm ? userStyles.error_message : postStyles.error_message}`}
              >
                {error}
              </p>
            ) : isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            ))}
        </div>
      )}
      {isUserForm && (
        <div className={userStyles.avatar_container}>
          {(imageUrl || defaultPhoto) && !error && !isUploading && (
            <img
              src={imageUrl || defaultPhoto}
              alt='Uploaded'
              className={userStyles.uploaded_image}
              data-test='uploaded-image'
            />
          )}

          {!imageUrl &&
            !defaultPhoto &&
            (error ? (
              <p
                className={`${isUserForm ? userStyles.error_message : postStyles.error_message}`}
              >
                {error}
              </p>
            ) : (
              <div className={userStyles.icon_stripe}>
                <img src={cameraIcon} alt='Camera icon' />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
