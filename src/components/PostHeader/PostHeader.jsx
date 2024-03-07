import CreatePostBtn from 'UI/CreatePostBtn';
import Checkbox from '../../UI/Checkbox/index';
import React from 'react';
import { useBlogContext } from 'BlogContext';

const PostHeader = ({ showCheckbox, leftText, rightText}) => {
  const { isChecked, handleCheckboxChange, isTrue, setIsTrue } =
    useBlogContext();


  return (
    <div className='post-header'>
      <div className='container'>
        <div className='post-header__section'>
          <div
            className='post-header__left'
            style={{ visibility: showCheckbox ? 'visible' : 'hidden' }}
          >
            {showCheckbox && (
              <>
                <Checkbox
                  id='myPostsId'
                  text='My Posts'
                  isTrue={isTrue}
                  setIsTrue={setIsTrue}
                  isChecked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </>
            )}
          </div>
          <div className='post-header__right'>
            <p className='post-header__feed'>{leftText}</p>
            <CreatePostBtn rightText={rightText} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
