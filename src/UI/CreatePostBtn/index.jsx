import { useBlogContext } from 'BlogContext';
import React from 'react';

export default function CreatePostBtn({ rightText }) {
  const { editMode, handleClick } = useBlogContext();

  return (
    <>
      <p className='post-header__plus-box'>
        {editMode ? 'Cancel' : rightText}

        <span
          onClick={() => handleClick(rightText)}
          data-test='post-header__plus'
        >
          +
        </span>
      </p>
    </>
  );
}
