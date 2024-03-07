import React from 'react';
import Modal from '../Modal/Modal';
import PostCreationForm from '../PostCreationForm/index';
import { useBlogContext } from 'BlogContext';

const EditPostModal = ({ post, onClose }) => {
  const { isSaving } = useBlogContext();

  return (
    <Modal onClose={onClose}>
      <h2>Edit Post</h2>
      <PostCreationForm editPostData={post} isSaving={isSaving} />
    </Modal>
  );
};

export default EditPostModal;
