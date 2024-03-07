import React from 'react';

const PostText = ({ text, showFullText }) => {
  if (!text) {
    return null;
  }

  if (!showFullText) {
    return null;
  }

  return <p className='post-content__body'>{text}</p>;
};

export default PostText;
